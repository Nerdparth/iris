from celery import shared_task
import random
import time

@shared_task
def analyze_sentiment_task(text):
    time.sleep(2)  
    sentiments = ["pos", "neg", "net"]
    return random.choice(sentiments)

