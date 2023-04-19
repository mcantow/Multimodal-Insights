from django.shortcuts import HttpResponseRedirect, render

def webSpeechExample_render(request):
    return render(request, "webSpeechExample.html")

def tool_render(request):
    return render(request, "tool.html")

def home_render(request):
    return render(request, "home.html")

def instructions_render(request):
    return render(request, "instructions.html")