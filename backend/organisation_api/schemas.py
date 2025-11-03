from ninja import Schema

class CreateOrganisationSchema(Schema):
    organisation_name: str
    industry: str


class JoinOrganisationSchema(Schema):
    user_id : str
    organisation_code : str