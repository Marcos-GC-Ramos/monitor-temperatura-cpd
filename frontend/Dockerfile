# Etapa base
FROM node:20-alpine

WORKDIR /app

# Copiar dependências
COPY package*.json ./

RUN npm install

# Copiar o restante do código
COPY . .

EXPOSE 5000

# Rodar em modo dev
CMD ["npm", "run", "dev"]
