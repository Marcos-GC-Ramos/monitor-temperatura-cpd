export const swaggerDoc = {
  openapi: "3.0.0",
  info: {
    title: "API de Monitoramento de Temperatura - CPD",
    version: "3.1.0",
    description: "API com autenticação JWT para registro e consulta de temperaturas.",
  },
  paths: {
    "/api/login": {
      post: {
        summary: "Login de usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "admin@cpd.com" },
                  senha: { type: "string", example: "admin123" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Token JWT" } },
      },
    },
    "/api/temperaturas": {
      get: {
        summary: "Retorna leituras recentes",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Lista de leituras" } },
      },
      post: {
        summary: "Cria nova leitura",
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "Leitura criada" } },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
};
