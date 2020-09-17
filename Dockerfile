FROM node:14
EXPOSE 8080
RUN mkdir /app
COPY index.js package* /app/
WORKDIR /app
RUN npm install
CMD [ "node", "index.js" ]
