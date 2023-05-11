from django.shortcuts import HttpResponseRedirect, render
import json
import random

def webSpeechExample_render(request):
    return render(request, "webSpeechExample.html")

def webgazer_example(request):
    return render(request, "webgazer_example.html")

def tool_render(request, datasetName):
    kwargs = {}
    if datasetName == 'dataset1':
        kwargs = dataset1_helper()
    if datasetName == 'dataset2':
        kwargs = dataset2_helper()
    return render(request, "tool.html", kwargs)

def dataset1_helper():
    peopleList = ['john', 'janice', 'jessica', 'jeff', 'josie', 'john']
    peopleCounts = [0,      0,        0,         0,      0     ,  1    ]
    peoplePicUrl = ['/static/img/john0.jpg', '/static/img/janice0.jpg', '/static/img/jessica0.jpg',
                    '/static/img/jeff0.jpg', '/static/img/josie0.jpg', '/static/img/john1.jpg']
    people = list(zip(peopleList, peopleCounts, peoplePicUrl))
    people = [ list(tup) for tup in people]
    peopleJson = json.dumps(people)
    with open('salesData.txt', 'r') as openfile:
        json_data = openfile.read()
    return {'peopleList':peopleList, 'peopleCounts':peopleCounts, 'peoplePicUrl':peoplePicUrl, 'people':people, 'peopleJson':peopleJson, 'json_data':json_data}

def dataset2_helper():
    peopleList = ['don', 'joanna', 'don', 'joanna', 'don']
    peopleCounts = [0,      0,        1,     1     ,  2    ]
    peoplePicUrl = ['/static/img/don0.jpg', '/static/img/joanna0.jpg', '/static/img/don1.jpg',
                    '/static/img/joanna1.jpg', '/static/img/don2.jpg']
    people = list(zip(peopleList, peopleCounts, peoplePicUrl))
    people = [ list(tup) for tup in people]
    peopleJson = json.dumps(people)
    with open('salesData2.txt', 'r') as openfile:
        json_data = openfile.read()
    return {'peopleList':peopleList, 'peopleCounts':peopleCounts, 'peoplePicUrl':peoplePicUrl, 'people':people, 'peopleJson':peopleJson, 'json_data':json_data}


def tool_options_render(request):
    return render(request, "tool_options.html")

def home_render(request):
    return render(request, "home.html")

def instructions_render(request):
    return render(request, "instructions.html")

def train_gazefilter(request):
    return render(request, "trainGazefilter.html")