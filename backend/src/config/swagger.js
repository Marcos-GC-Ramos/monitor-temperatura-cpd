export const swaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: "API de Monitoramento de Temperatura - CPD",
    version: "4.0.0",
    description:
      "API com autenticação JWT para registro e consulta de temperaturas e gerenciamento de usuários.",
  },
  servers: [
    { url: "https://monitor-temperatura-cpd.onrender.com/"},
  ],
  tags: [
    { name: "Autenticação" },
    { name: "Usuários" },
    { name: "Temperaturas" },
  ],
  paths: {
    "/api/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Login de usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              example: { email: "admin@cpd.com", senha: "admin123" },
            },
          },
        },
        responses: {
          200: { description: "Credenciais válidas" },
          401: { description: "Credenciais inválidas" },
        },
      },
    },
    "/api/usuarios": {
      get: {
        tags: ["Usuários"],
        summary: "Retorna listagem de usuários",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Lista de usuários" },
          401: { description: "Não autorizado" },
        },
      },
      post: {
        tags: ["Usuários"],
        summary: "Cria novo usuário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                nome: "Alice Silva",
                email: "alice@cpd.com",
                senha: "SenhaForte@123",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário criado",
          },
          400: { description: "Dados inválidos" },
          401: { description: "Não autorizado" },
          409: { description: "E-mail já está em uso" },
        },
      },
      put: {
        tags: ["Usuários"],
        summary: "Atualiza um usuário",
        description:
          "Atualiza os dados de um usuário existente. Envie apenas os campos que deseja alterar.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: {
                id: 42,
                nome: "Julia V. (atualizado)",
                email: "julia.v@cpd.com",
                senha: "NovaSenha@456"
              },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário atualizado",
          },
          400: { description: "Dados inválidos" },
          401: { description: "Não autorizado" },
          404: { description: "Usuário não encontrado" },
          409: { description: "E-mail já está em uso" },
        },
      },
      delete: {
        tags: ["Usuários"],
        summary: "Deleta usuário",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              example: { id: 42 },
            },
          },
        },
        responses: {
          200: {
            description: "Usuário deletado",
          },
          400: { description: "Dados inválidos" },
          401: { description: "Não autorizado" },
          404: { description: "Usuário não encontrado" },
        },
      },
    },

    "/api/temperaturas": {
      get: {
        tags: ["Temperaturas"],
        summary: "Retorna listagem de leituras",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Lista de leituras" },
          401: { description: "Não autorizado" },
        },
      },
      post: {
        tags: ["Temperaturas"],
        summary: "Cria nova leitura",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              example: {
                temperatura: 27.35,
                umidade: 55.2,         // opcional, se houver
                coletadoEm: "2025-10-21T14:25:00Z" // opcional
              },
            },
          },
        },
        responses: {
          201: { description: "Leitura criada" },
          400: { description: "Dados inválidos" },
          401: { description: "Não autorizado" },
        },
      },
      delete: {
        tags: ["Temperaturas"],
        summary: "Deleta leitura",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              example: { id: 99 },
            },
          },
        },
        responses: {
          201: { description: "Leitura deletada" },
          400: { description: "Dados inválidos" },
          401: { description: "Não autorizado" },
          404: { description: "Leitura não encontrada" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
};
