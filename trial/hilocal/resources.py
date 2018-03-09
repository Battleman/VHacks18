from tastypie.resources import ModelResource
from hilocal.models import User
from hilocal.models import Event

class UserResource(ModelResource):
    class Meta:
        queryset = User.objects.all()
        resource_name = 'user'
        #authorization = Authorization()


class EventResource(ModelResource):
    class Meta:
        queryset = Event.objects.all()
        resource_name = 'event'
        #authorization = Authorization()
