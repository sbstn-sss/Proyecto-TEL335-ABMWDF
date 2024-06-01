FROM node:20-alpine

RUN mkdir -p /home/app
COPY . /home/app
WORKDIR /home/app

# Instala nodemon como una dependencia de desarrollo
RUN npm i

EXPOSE 8080

# Asigna npm start a CMD
CMD ["npm", "start"]