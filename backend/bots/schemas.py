from ninja import Schema


class CreateBotSchema(Schema):
    organisation_uuid: str
    bot_name: str
    bot_description: str
    color_1: str
    color_2: str
    text_color: str


class CreateSupabaseChatSchema(Schema):
    ip_address : str
    bot_id : str

class SendChatMessageSchema(Schema):
    chat_id: int
    message: str
    sender: str