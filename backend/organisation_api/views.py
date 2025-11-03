from django.db import IntegrityError
from django.http import JsonResponse
from httpx import post
from ninja import NinjaAPI
from django.contrib.auth.models import User
from .schemas import CreateOrganisationSchema, JoinOrganisationSchema
from .models import Organisation, OrganisationMember
import random, string

organisation_api = NinjaAPI(urls_namespace="iris_api")


@organisation_api.post("/create-organisation")
def create_organisation(request, data: CreateOrganisationSchema):
    try:
        try:
            tail = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            organisation_code = f"{data.organisation_name[:4].upper()}{tail}"
            organisation = Organisation.objects.create(organisation_name=data.organisation_name, organisation_code=organisation_code, industry=data.industry)
            return JsonResponse({"message": "organisation created successfully", "organisation_code" : organisation_code, "uuid" : organisation.uuid})
        except IntegrityError:
            create_organisation(request=request, data=data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

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