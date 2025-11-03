from django.shortcuts import render

from ninja import Router
from datetime import datetime
from .tasks import send_email_task
router = Router()

@router.get("/status")
def get_status(request):
    return {"status": "ok"}

@router.post("/send-email")
def send_email(request, recipient_email: str, user_name: str, body_message: str):
    subject = "Welcome to Akall Ki Fauj!"
    template = "email.html"
    context = {
        "user_name": user_name,
        "body_message": body_message,
        "year": datetime.now().year,
        "text_message": f"Hi {user_name},\n\n{body_message}\n\nBest,\nCodeBuzz Team"
    }
    task = send_email_task.delay(recipient_email, subject, context, template)

    return {"message": f"Email sent to {recipient_email} with subject '{subject}'."}