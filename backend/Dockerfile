FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

#build project
RUN npm run build

#start production
CMD ["npm", "run", "start:prod"]
