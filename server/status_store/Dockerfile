FROM python:3.7.2
ADD ./app /usr/src/app
WORKDIR /usr/src/app
RUN pip install -r requirements.txt 
CMD [ "python", "/usr/src/app/status_store.py" ]