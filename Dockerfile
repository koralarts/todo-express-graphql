FROM node:latest

WORKDIR /usr/src/app

COPY ["package.json", "tsconfig.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

COPY . /var/www/api

RUN ls -a

RUN cd /var/www/api && npm install && mv node_modules ../

EXPOSE 3000

RUN ["npm", "run", "build"]

CMD ["npm", "run", "start"]
