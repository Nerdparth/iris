from celery import shared_task
from django.core.mail import send_mail,EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string

@shared_task
def send_email_task(recipient_email, subject, context, template):
    html_content = render_to_string(template, context)
    text_content = context.get("text_message", "Fuck email service")
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        to=[recipient_email]
    )
    email.attach_alternative(html_content, "text/html")
    email.send()

    return {"status":"email send"}
    