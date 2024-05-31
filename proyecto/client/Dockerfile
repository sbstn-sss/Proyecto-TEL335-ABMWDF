FROM node:20-alpine

RUN mkdir -p /home/app 

COPY . /home/app 

WORKDIR /home/app

RUN npm install nodemon --save-dev

EXPOSE 3000

CMD ["npm", "start"]