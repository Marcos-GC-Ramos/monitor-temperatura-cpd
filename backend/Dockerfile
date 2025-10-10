# Etapa base
FROM node:20-alpine

WORKDIR /app

# Copiar dependências
COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

# Copiar código-fonte
COPY . .

EXPOSE 3000

CMD ["nodemon", "src/server.js"]
