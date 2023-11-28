FROM node:14.19.1

COPY . /app
WORKDIR /app
RUN npm install

# cannot find module react-refresh/main.js 오류 해결
RUN npm i -D react-refresh 
ENV FAST_REFRESH false

EXPOSE 3000

CMD ["npm", "start"]
