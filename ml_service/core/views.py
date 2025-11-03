from django.shortcuts import render
from .tasks import analyze_sentiment_task
from django.http import JsonResponse 
from ninja import Router

ml_router = Router()

@ml_router.get("/status")
def get_status(request):
    return {"status": "ML Service is running"}  

@ml_router.post("/predict-sentiment")
def predict(request, text: str):
    task = analyze_sentiment_task.delay(text)
    return JsonResponse({
        "success": True,
        "message": "analyse started",
        "task_id": task.id
    })


