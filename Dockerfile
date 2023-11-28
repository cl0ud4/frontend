FROM node:14.19.1

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

RUN npm i -D react-refresh 
# RUN npm install react-scripts@3.0.1 -g


ENV FAST_REFRESH false

EXPOSE 3000

CMD ["npm", "start"]
