# Multimodal-Insights
Final project for Multimodal User Interfaces. Sales dashboard enabling concurrent voice and mouse gesture interactions. 

## Getting Started
This project uses Django as a webserver so the files function in a browser properly. Follow the steps below to get it running on your machine. 

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


## Creation Notes
- Needed to run a webserver so browser would not prompt audio connection each time. Used django for this
