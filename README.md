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

### Step 1, Clone Repo, Prepare To Setup
```console
git clone https://github.com/mcantow/Multimodal-Insights
```

### Step 2, Run the Docker Daemon
This is done most easily by [downloading docker desktop](https://www.docker.com/products/docker-desktop/). Opening the desktop application which automatically starts the daemon. There are [alternatives](https://docs.docker.com/get-docker/) 

### Step 3, fix .sh permissions
- Windows (in admin terminal, preferable to use [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install)):
    ```console
    icacls entrypoint.sh /reset
    ```
- Mac:
    ```console
    chmod +x entrypoint.sh
    ```

### Step 4, run application with logs
```console
docker compose -f docker-compose.dev.yml build
```
```console
docker compose -f docker-compose.dev.yml up
```

The server is now running at http://127.0.0.1. Note server logs are being printed which is useful for debugging. Print statements from the view functions are printed here in addition to the request logs. Also note the server is running on http://127.0.0.1 and not http://127.0.0.1:8000 like the venv development server. While the wsgi server is running on port 8000, it is not exposed to the web, rather only internally to other docker services. Now, nginx is listending on port 80, the default http port, which is the new gateway to the application.

### Troubleshooting
When setting up the docker server for the first time, there are some common issues that can happen; this readme will be updated with solutions to these problems as we encounter them

1. (`docker-compose`) is being replaced by (`docker compose`), which can be confusing now based on your docker version. If not automatically installed, [see here to upgrade to the new version](https://docs.docker.com/compose/install/)
2. Another issue that is easy to run into is nginx (or possibly another component) saying the port is blocked. While you can run `docker-compose up -p PORT_NUMBER` to run on a different port, it is advisable to figure out what is blocking the original port, since that may cause problems in the future. If you are running Ubuntu, the most [common](https://stackoverflow.com/questions/14972792/nginx-nginx-emerg-bind-to-80-failed-98-address-already-in-use) problem is Apache listening on that port by default. If you are not using or don't need apache to be running on that port, you can kill the process with `sudo /etc/init.d/apache2 stop` on Ubuntu and `sudo apachectl stop` on other Linux Distros. Please be careful with sudo commands, and always run them at your own peril (the command itself is innocuous, but it is always important to keep that advice in mind). If that does not work, you may need to look up "how to see what is binding port 80 on Windows/Mac/Linux", find the process, and kill it (if it is not important). Sadly, the number of methods to this are too many to enumerate, but it should be a straightforward process.



## Production Docker <a name="proddocker"></a>

### Step 1, install docker (if new machine)
[install docker on a linux machine](https://docs.docker.com/engine/install/ubuntu/)

### Step 2, clone repo (if new machine)
To clone the git repo, you can [generate an ssh key and configure it in your bitbucket account](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/BitBucket-SSH-Key-Example). 

### Step 3, setup certificates (if new machine)
There is an additional step to generate the first ssl certificates, which can be done by running  ./init-certbot.sh. There is a very annoying problem with https and nginx that nginx cannot boot without ssl certificates, and cannot generate certificates without booting. This script uses a plugin to generate the first certificate batch before certbot takes over. 

### Step 4, run application, server maintenence commands
The production docker-compose file is just docker-compose.yml, not docker-compose.dev.yml. This version will not build on your local machine due to the ssl certificate script. Nonetheless, commands are the same for this version as the dev version, simply removing the "-f docker-compose.prod.yml" substring from the commands. 

Build and spin up in silent mode
```console
docker compose up -d --build
```

