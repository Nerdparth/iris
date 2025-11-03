from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse
from ninja import NinjaAPI


auth_api = NinjaAPI(urls_namespace="auth_api")


@auth_api.post("/create-account")
def create_account(request, user_id : str):
    try:
        if User.objects.filter(username = user_id).exists():
            return JsonResponse({"error" : "User Id is not unique"}, status=400)
        else:
            User.objects.create(username=user_id)
            return JsonResponse({"message" : "User created successfully"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

