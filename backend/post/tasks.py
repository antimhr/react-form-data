from celery import shared_task
from httplib2 import Response
from time import sleep
from celery_progress.backend import ProgressRecorder
from post.serializers import PostSerializer
from rest_framework import status


@shared_task
def file_upload_task(data):
    print("File Uploading")
    sleep(5)
    posts_serializer = PostSerializer(data=data)
    if posts_serializer.is_valid():
        posts_serializer.save()
        print("File Uploaded successfully")
        # return Response(posts_serializer.data)
        return "Celery Done"
    else:
        print('error', posts_serializer.errors)
        return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@shared_task(bind=True)
def go_to_sleep(self, duration):
    progress_recorder = ProgressRecorder(self)
    for i in range(5):
        sleep(duration)
        progress_recorder.set_progress(i + 1, 5, f'On iteration {i}')
    return 'Done'


@shared_task()
def add(x, y):
    return x + y


