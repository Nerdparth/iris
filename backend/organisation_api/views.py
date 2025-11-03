from django.db import IntegrityError
from django.http import JsonResponse
from httpx import post
from ninja import NinjaAPI
from django.contrib.auth.models import User
from .schemas import CreateOrganisationSchema, JoinOrganisationSchema, UpdateOrganisationSchema
from .models import Organisation, OrganisationMember
from bots.models import Bot
from django.forms.models import model_to_dict
import random, string

organisation_api = NinjaAPI(urls_namespace="iris_api")

    

@organisation_api.post("/join-organisation")
def join_organisation(request, data: JoinOrganisationSchema):
    try:
        if not User.objects.filter(username = data.user_id).exists():
            return JsonResponse({"error": "you are not a valid user of our Services"}, status=400)
        else:
            user = User.objects.get(username = data.user_id)
        if not Organisation.objects.filter(organisation_code = data.organisation_code).exists():
            return JsonResponse({"error": "incorrect organisation code"}, status=400)
        else:
            organisation = Organisation.objects.get(organisation_code = data.organisation_code)
        if not OrganisationMember.objects.filter(member = user, organisation=organisation).exists():
            OrganisationMember.objects.create(member = user, organisation=organisation)
            return JsonResponse({"message" : "you have been added to the organisation successfully"}, status=200)
        else:
            return JsonResponse({"error" : "you are already a part of the organisation"} , status=400)
    except Exception as e:
        return JsonResponse({"error" : str(e)}, status=400)
    

    
@organisation_api.post("/create-organisation")
def create_organisation(request, data: CreateOrganisationSchema):
    try:
        try:
            if not User.objects.filter(username= data.user_id).exists():
                return JsonResponse({"error" : "user is not valid"})
            else:
                user = User.objects.get(username= data.user_id)
            if OrganisationMember.objects.filter(member = user).exists():
                return JsonResponse({"error" : "you already are in an organisation"})
            tail = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            organisation_code = f"{data.organisation_name[:4].upper()}{tail}"
            organisation = Organisation.objects.create(organisation_name=data.organisation_name, organisation_code=organisation_code, industry=data.industry)
            OrganisationMember.objects.create(organisation = organisation, member=user, is_admin=True)
            return JsonResponse({"message": "organisation created successfully", "organisation_code" : organisation_code, "uuid" : organisation.uuid})
        except IntegrityError:
            create_organisation(request=request, data=data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@organisation_api.get("/dashboard-data")
def dashboard_data(request, user_id: str):
    try:
        if not User.objects.filter(username=user_id).exists():
            return JsonResponse({"error" : "user doesn't exist"}, status=400)
        else:
            user = User.objects.get(username=user_id)
        if not OrganisationMember.objects.filter(member = user).exists():
            return JsonResponse({"error" : "You are not the part of any organisation"}, status=302)
        else:
            organisation_member_object = OrganisationMember.objects.get(member = user)
            organisation = model_to_dict(Organisation.objects.get(id = organisation_member_object.organisation.id))
            bots = list(Bot.objects.filter(organisation = organisation_member_object.organisation).values())
            return JsonResponse({"message" : "fetched details successfully", "organisation" : organisation, "bots" : bots})
    except Exception as e:
        return JsonResponse({"error" : str(e)}, status = 400)
    

@organisation_api.put('/update-organisation')
def update_organisation(request, data: UpdateOrganisationSchema):
    try:
        if not User.objects.filter(username = data.user_id).exists():
            return JsonResponse({'error':'you are not a valid user of our Services'}, status=400)
        else:
            user = User.objects.get(username = data.user_id)
        if not Organisation.objects.filter(uuid = data.uuid).exists():
            return JsonResponse({'error':'incorrect organisation code'}, status=400)
        else:
            organisation = Organisation.objects.get(uuid = data.uuid)
        if not OrganisationMember.objects.filter(member = user, organisation=organisation, is_admin=True).exists():
            return JsonResponse({'error':'you are not authorised to make these changes'} , status=400)
        else:
            if data.new_organisation_name:
                organisation.organisation_name = data.new_organisation_name
            if data.new_industry:
                organisation.industry = data.new_industry
            organisation.save()
            return JsonResponse({'message':'organisation details updated successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error':str(e)},status=400)
    

@organisation_api.delete('/delete-organisation')
def delete_organisation(request, uuid: str, user_id: str):
    try:
        if not User.objects.filter(username=user_id).exists():
            return JsonResponse({'error':'You are not authorized to make these changes'},status=400)
        else:
            user=User.objects.get(username=user_id)
        if not Organisation.objects.filter(uuid=uuid).exists():
            return JsonResponse({'error':'incorrect organisation code'},status=400)
        else:
            organisation=Organisation.objects.get(uuid=uuid)
        if not OrganisationMember.objects.filter(member=user,organisation=organisation,is_admin=True).exists():
            return JsonResponse({'error':'You are not authorized to make these changes'},status=400)
        else:
            organisation.delete()
            return JsonResponse({'message':'organisation deleted successfully'},status=200)
    except Exception as e:
        return JsonResponse({'error':str(e)},status=400)