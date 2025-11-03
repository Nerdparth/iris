from django.shortcuts import render
from django.http import JsonResponse
from .schemas import CreateBotSchema, CreateSupabaseChatSchema, SendChatMessageSchema
from .models import Bot
from organisation_api.models import Organisation
from django.db import transaction
from supabase_client import supabase
from .utils import generate_embedding_and_store, chunkify_data, extract_text_from_file
from django.views.decorators.clickjacking import xframe_options_exempt
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from httpx import get
from dotenv import load_dotenv
import os


bots_api = NinjaAPI(urls_namespace="bots_api")
load_dotenv()


from ninja import File, Form
from ninja.files import UploadedFile
from django.http import JsonResponse
from django.db import transaction
import os

@bots_api.post("/create-bot")
def create_bot(request, data: CreateBotSchema = Form(...), file: UploadedFile = File(...)):
    try:
        extension = os.path.splitext(file.name)[1]

        if not Organisation.objects.filter(uuid=data.organisation_uuid).exists():
            return JsonResponse({"error": "Your Organisation doesn't exist"}, status=400)

        organisation = Organisation.objects.get(uuid=data.organisation_uuid)

        with transaction.atomic():
            bot = Bot.objects.create(
                organisation=organisation,
                bot_name=data.bot_name,
                bot_description=data.bot_description,
                color_1=data.color_1,
                color_2=data.color_2,
                text_color=data.text_color,
            )

            text = extract_text_from_file(file=file, extension=extension)
            if text is None:
                return JsonResponse({"error": "unsupported file types for bot"}, status=400)

            chunks = chunkify_data(text=text)
            for chunk in chunks:
                generate_embedding_and_store(text=chunk, bot_uuid=bot.uuid)

            return JsonResponse({"message": "generated bot successfully"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@bots_api.post("/create-supabase-chat")
def get_or_create_supabase_chat(request, data: CreateSupabaseChatSchema):
    try:
        existing_chat = supabase.table("Chats").select("id").eq("bot_id", data.bot_id).eq("ip_address", data.ip_address).execute()
        if len(existing_chat.data) > 0:
            return JsonResponse({"message" : "existing chat found", "chat" : existing_chat.data[0]}, status=302)
        ip_data = get(f"https://ipinfo.io/{data.ip_address}/json").json()
        new_chat = supabase.table("Chats").insert({
            "bot_id": data.bot_id,
            "ip_address": data.ip_address,
            "city": ip_data["city"],
            "region" : ip_data["region"],
            "country" : ip_data["country"]
        }).execute()
        return JsonResponse({"message" : "chat created successfully", "chat" : new_chat.data[0]}, status=200)
    except Exception as e:
        return JsonResponse({"error" : str(e)}, status=400)
        

@bots_api.get("/get-messages/{chat_id}")
def get_messages(request, chat_id : int):
    try:
        messages_request = supabase.table("ChatMessages").select("*").eq("chat_id", int(chat_id)).execute()
        messages = messages_request.data
        return JsonResponse({"message": "successfully fetched messages", "messages" : messages}, status=200)
    except Exception as e:
        return JsonResponse({"error" : str(e)}, status=400)
    
@bots_api.post("/send-message")
def send_message(request, data: SendChatMessageSchema):
    try:
        chat_checker = supabase.table("Chats").select('*').eq("id", data.chat_id).execute()
        if len(chat_checker.data) == 0:
            return JsonResponse({"error" : "no existing chat found"}, status=400)
        supabase.table("ChatMessages").insert({
            "chat_messages" : data.message,
            "sender" : data.sender,
            "chat_id" : int(data.chat_id)
        }).execute()
        return JsonResponse({"message" : "sent successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error" : str(e)}, status=400)
    
    
    
@xframe_options_exempt
def iframe(request, organisation_id, bot_id):
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    bot = Bot.objects.get(uuid=bot_id)
    return render(request, "bots/iframe.html", {"bot" : bot, "supabase_url" : supabase_url, "supabase_key" : supabase_key})