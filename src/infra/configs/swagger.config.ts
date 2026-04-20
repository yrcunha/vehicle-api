import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export default (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle("API de Gerenciamento de Veículos")
    .setDescription(
      "API REST para gerenciamento de veículos com validações de placa (Mercosul/Antiga), chassi (ISO 3779:2009) e RENAVAM.\n\n" +
        "## Recursos\n" +
        "- CRUD completo de veículos\n" +
        "- Validação de formatos brasileiros (placa, chassi, RENAVAM)\n" +
        "- Soft delete para manutenção de histórico\n" +
        "- Paginação e filtros de busca\n" +
        "- Arquitetura baseada em DDD com Value Objects",
    )
    .setVersion("1.0")
    .addTag("vehicles", "Operações de gerenciamento de veículos")
    .addServer("http://localhost:3000", "Ambiente de Desenvolvimento")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #e0234e }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "none",
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: { theme: "monokai" },
    },
  });
};
