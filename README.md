# 🌡️ Monitor de Temperatura - CPD

> 🚀 API de monitoramento de temperatura para o **Centro de Processamento de Dados (CPD)**.  
> Desenvolvida em **Node.js + Express**, com banco **PostgreSQL**, autenticação **JWT** e documentação **Swagger UI**.  
> O projeto roda totalmente em **Docker**, sem necessidade de instalações manuais.

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?logo=swagger&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-blue)
### Pré-requisitos

- [🔗 Node.js](https://www.nodejs.tech/pt-br/download/)
- [🔗 Docker Engine](https://docs.docker.com/engine/install/)
- [🔗 Docker Compose](https://docs.docker.com/compose/install/)
- [🔗 DBeaver](https://dbeaver.io/) ou qualquer um da sua preferencia para visualizar o banco


### Estrutura do Projeto

```bash
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
```

### Executar o projeto

#### Subir os containers

```bash
docker compose up -d --build
```

Esse comando irá:
 - Subir o PostgreSQL (db_monitor)

 - Criar o banco monitor_temperatura

 - Criar automaticamente o usuário admin

 - Subir a API (api_monitor) na porta 3000

## Autor

- [@Marcos-GC-Ramos](https://github.com/Marcos-GC-Ramos)
- marcosgustavoramos72@gmail.com



## License

[MIT](https://choosealicense.com/licenses/mit/)

