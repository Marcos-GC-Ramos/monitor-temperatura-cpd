# 🌡️ Monitor de Temperatura - CPD

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?logo=swagger&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-blue)

> 🚀 API de monitoramento de temperatura para o **Centro de Processamento de Dados (CPD)**.  
> Desenvolvida em **Node.js + Express**, com banco **PostgreSQL**, autenticação **JWT** e documentação **Swagger UI**.  
> O projeto roda totalmente em **Docker**, sem necessidade de instalações manuais.

---

## 🧱 Estrutura do Projeto

monitor-temperatura-cpd/
└── backend/
├── docker-compose.yml
├── Dockerfile
├── package.json
└── src/
├── config/
│ ├── db.js
│ └── swagger.js
├── controllers/
│ ├── loginController.js
│ └── temperaturaController.js
├── middleware/
│ └── auth.js
├── routes/
│ ├── login.routes.js
│ └── temperatura.routes.js
├── utils/
│ └── seedAdmin.js
└── server.js


---

## ⚙️ Tecnologias principais

| Categoria | Ferramenta |
|------------|-------------|
| 🧩 Backend | Node.js + Express |
| 🐘 Banco de dados | PostgreSQL 16 |
| 🔒 Autenticação | JWT (JSON Web Token) |
| 🐳 Containers | Docker + Docker Compose |
| 📘 Documentação | Swagger UI |
| 🧠 ORM / Query | `pg` (PostgreSQL Client) |

---

## 🧰 Pré-requisitos

Antes de rodar o projeto, instale:

- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- (opcional) [DBeaver](https://dbeaver.io/) — para visualizar o banco

---

## 🚀 Como executar o projeto

### 🐳 1️⃣ Subir os containers

Entre na pasta `backend` e execute:

```bash
sudo docker compose up -d --build

Esse comando irá:

Subir o PostgreSQL (db_monitor)

Criar o banco monitor_temperatura

Criar automaticamente o usuário admin

Subir a API (api_monitor) na porta 3000

🔑 2️⃣ Login padrão
Campo	Valor
Email:	admin@cpd.com
Senha:	admin123

Use esses dados para gerar um token JWT no endpoint /api/login.

📘 3️⃣ Acessar o Swagger

Depois que o container estiver rodando, abra:

👉 http://localhost:3000/docs

Lá você poderá:

Fazer login (POST /api/login)

Criar novas leituras (POST /api/temperaturas)

Consultar as últimas temperaturas (GET /api/temperaturas)

💡 Após o login, clique no botão Authorize 🔒 e insira o token JWT com o prefixo:

Bearer SEU_TOKEN_AQUI

🐘 4️⃣ Acessar o banco de dados (opcional)

Conecte-se via DBeaver ou CLI PostgreSQL:

Parâmetro	Valor
Host	localhost
Porta	5432
Banco	monitor_temperatura
Usuário	nodeuser
Senha	123456

Tabela principal: leituras

🔐 Endpoints principais
Método	Rota	Descrição
POST	/api/login	Faz login e retorna o token JWT
GET	/api/temperaturas	Retorna as leituras de temperatura (protegido)
POST	/api/temperaturas	Cria uma nova leitura (protegido)
🧩 Exemplo de uso via curl
# Login
curl -X POST http://localhost:3000/api/login \
-H "Content-Type: application/json" \
-d '{"email": "admin@cpd.com", "senha": "admin123"}'

# Criar nova leitura
curl -X POST http://localhost:3000/api/temperaturas \
-H "Authorization: Bearer SEU_TOKEN_AQUI" \
-H "Content-Type: application/json" \
-d '{"temperatura": 56.4, "alarme": true}'

🧰 Comandos úteis
Ação	Comando
🟢 Subir containers	sudo docker compose up -d
🔴 Parar containers	sudo docker compose down
🔁 Reconstruir containers	sudo docker compose up -d --build
🧾 Logs da API	sudo docker logs -f api_monitor
🐚 Entrar no container da API	sudo docker exec -it api_monitor sh
🐘 Entrar no PostgreSQL	sudo docker exec -it db_monitor psql -U nodeuser monitor_temperatura
🧠 Próximas melhorias

 Dashboard visual em Next.js

 Alertas automáticos (e-mail / Telegram)

 Histórico e gráficos de temperatura

 Deploy automático via GitHub Actions

👨‍💻 Autor

Marcos GC Ramos
📧 admin@cpd.com

🌐 GitHub: @Marcos-GC-Ramos

🧩 Licença

Este projeto está sob licença MIT — sinta-se à vontade para usar e modificar.


---

## ✨ Resultado visual no GitHub

Quando você abrir esse README no repositório, ele vai ter:

- Badges coloridos (Node, Docker, Swagger, PostgreSQL)  
- Tabelas limpas com ícones e seções destacadas  
- Instruções passo a passo prontas pra qualquer dev clonar e rodar  
- Toque profissional e de portfólio 💼  

---

Quer que eu adicione nesse README um **bloco de “Deploy com Docker”** (com instruções pra subir em servidor remoto, tipo EC2, VPS ou VM local)? Isso deixa pronto pra produção.