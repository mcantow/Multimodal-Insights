# Multimodal-Insights
Final project for Multimodal User Interfaces. Sales dashboard enabling concurrent voice and gaze interactions. To use the system I recommend using the website version at https://multimodalinsights.com 

## Table of Contents
1. [Repo Overview](#overview)
    1. [High Level](#highLevel)
    2. [audio_app](#audio_app)
    3. [audio_server](#audio_server)
    4. [nginx](#nginx)
    5. [Testing](#testing)
2. [Getting Started](#getting_started)
3. [Local Venv Mode](#localvenv)
4. [Local Docker Mode](#localdocker)
5. [Production Docker Mode](#proddocker)

## Getting Started <a name="getting_started"></a>
The system can run in three modes: local venv, local docker, and production docker. I find the local venv version is most convenient, but I don't have comprehensive specs on supported python and OS versions, so I cant gurentee it works on every machine. This mode essentially runs the django code in a virtual environment with the systems host operating system and python installation, making the application available on localhost:8000. I also provide local docker build instructions, that run the entire application stack and makes the application available on localhost. This mode is much more relaible but heavier. I also include a production docker build for deployment. 

## Local Venv <a name="localvenv"></a>
### Step 1, Clone Repo, Prepare To Setup
- Check you have [python](https://www.python.org/downloads/) and [pip](https://packaging.python.org/en/latest/tutorials/installing-packages/) installed on your system. Using VSCode is recommended. Tested using python 3.9
```console
git clone https://github.com/mcantow/Multimodal-Insights
```

### Step 2, Create and activate virtual environment 
- Navigate to the folder you just cloned
- Create the Virtual Environment (only do once)
    - Windows: *note: depending on your setup you may need to replace "python" with "py"* 
        ```console
        pip install virtualenv
        ```
        ```console
        python -m venv venv
        ```
    - Mac:
        ```console
        pip3 install virtualenv
        ```
        ```console
        python3 -m venv venv
        ```
- Activate the Virtual Environment
    - Windows:
        ```console
        venv\scripts\activate
        ```
    - Mac:
        ```console
        source venv/bin/activate
        ```
        

### Step 3, Install Python dependencies 
- Windows:
    ```console
    pip install -r requirements.txt
    ```
- Mac:
    ```console
    pip3 install -r requirements.txt
    ``` 

### Step 4, Run Django dev server
- Windows: 
    ```console
    python manage.py runserver
    ```
- Mac: 
    ```console
    python3 manage.py runserver
    ```
### Step 5, additional notes
- The server should be running locally at http://127.0.0.1:8000


## Local Docker <a name="localdocker"></a>

## Production Docker <a name="proddocker"></a>

