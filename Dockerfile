FROM node:4.2
RUN mkdir /code
WORKDIR /code
RUN apt-get update && apt-get install -y libpq-dev && rm -rf /var/lib/apt/lists/*
ADD package.json /code/
RUN npm install -g nodemon && npm install
ADD . /code/app
