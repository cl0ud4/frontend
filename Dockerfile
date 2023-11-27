FROM --platform=linux/amd64 node:16

WORKDIR /app

COPY package.json .

RUN npm install --save --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]