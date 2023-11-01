FROM node:18-alpine

WORKDIR /app_chat/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8001

RUN npx prisma generate
# RUN npx prisma migrate dev --name init
# RUN npx prisma db push

CMD ["npm","run","start"]

