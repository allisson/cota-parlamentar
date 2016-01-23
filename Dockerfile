FROM node:4.2
RUN mkdir /code
WORKDIR /code
RUN apt-get update && apt-get install -y libpq-dev && apt-get clean && rm -rf /var/lib/apt/lists/*
ADD package.json /code/
RUN npm install -g nodemon && npm install
ADD . /code/app
ADD config/config.json.docker /code/app/config/config.json
EXPOSE 3000
CMD ["node", "/code/app/bin/www"]
