from django.shortcuts import HttpResponseRedirect, render
import json

def webSpeechExample_render(request):
    return render(request, "webSpeechExample.html")

def webgazer_example(request):
    return render(request, "webgazer_example.html")

def tool_render(request):
    peopleList = ['john', 'janice', 'jessica', 'jeff', 'josie', 'john']
    peopleCounts = [0,      0,        0,         0,      0     ,  0    ]
    peoplePicUrl = ['/static/img/john0.jpg', '/static/img/janice0.jpg', '/static/img/jessica0.jpg',
                    '/static/img/jeff0.jpg', '/static/img/josie0.jpg', '/static/img/john1.jpg']
    people = list(zip(peopleList, peopleCounts, peoplePicUrl))
    people = [ list(tup) for tup in people]
    peopleJson = json.dumps(people)
    return render(request, "tool.html", {'peopleList':peopleList, 'peopleCounts':peopleCounts, 'peoplePicUrl':peoplePicUrl, 'people':people, 'peopleJson':peopleJson})

def home_render(request):
    return render(request, "home.html")

def instructions_render(request):
    return render(request, "instructions.html")

def train_gazefilter(request):
    return render(request, "trainGazefilter.html")