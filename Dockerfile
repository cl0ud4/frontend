FROM node:14

WORKDIR /app

COPY package.json .

RUN npm cache clean --force
RUN npm install --force
RUN npm i react-scripts

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
