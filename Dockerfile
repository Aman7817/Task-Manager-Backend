FROM node:18

WORKDIR /app

RUN npm config set registry https://registry.npmjs.org/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
