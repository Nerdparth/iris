from ninja import Schema

class CreateOrganisationSchema(Schema):
    organisation_name: str
    industry: str


class JoinOrganisationSchema(Schema):
    user_id : str
    organisation_code : str

class UpdateOrganisationSchema(Schema):
    user_id:str
    uuid: str
    new_organisation_name: str = None
    new_industry: str = None


