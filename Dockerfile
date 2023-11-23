FROM node:16

COPY . /app
WORKDIR /app

RUN npm install --force

EXPOSE 3000

CMD ["/usr/local/bin/npm", "start"]