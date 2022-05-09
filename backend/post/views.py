
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .tasks import file_upload_task, go_to_sleep


def index(request):
    task = go_to_sleep.delay(1)

    return render(request, 'post/index.html', {'task_id': task.task_id})


class PostView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        file_upload_task(request.data)
        return HttpResponse("File Uploaded")
