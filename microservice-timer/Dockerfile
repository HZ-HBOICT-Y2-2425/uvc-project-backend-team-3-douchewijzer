FROM node:23

WORKDIR /code

COPY code/package.json ./
RUN npm install

COPY code/ ./

CMD ["npm", "run", "dev"]