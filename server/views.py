from django.shortcuts import HttpResponseRedirect, render

def webSpeechExample_render(request):
    return render(request, "webSpeechExample.html")