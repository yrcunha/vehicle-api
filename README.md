# API de Gerenciamento de Veículos

API REST para gerenciamento de veículos desenvolvida com NestJS, TypeScript, MikroORM e MongoDB, seguindo princípios de Domain-Driven Design (DDD) e Clean Architecture.

## 🏗️ Arquitetura

O projeto foi estruturado em camadas, segregando responsabilidades e isolando a lógica de negócio:

### Camadas da Aplicação

```
src/
├── core/
│   ├── domain/           # Camada de Domínio (regras de negócio)
│   │   ├── entities/     # Entidades do domínio
│   │   └── objects/      # Value Objects
│   └── services/         # Camada de Aplicação (casos de uso)
└── infra/
    ├── http/            # Camada de Apresentação (controllers, DTOs)
    └── database/        # Camada de Infraestrutura (configuração ORM)
```

## 🎯 Domain-Driven Design (DDD)

### Value Objects

A decisão de isolar as regras de negócio em **Value Objects** foi estratégica, considerando que cada identificador veicular possui regulamentações próprias e validações específicas:

#### **Placa (`Plate`)**

- Suporta dois formatos conforme Resolução CONTRAN 729/2018:
  - **Formato Antigo**: `AAA9999` (3 letras + 4 números)
  - **Formato Mercosul**: `AAA9A99` (3 letras + 1 número + 1 letra + 2 números)
- Validação automática baseada no 5º caractere

#### **Chassi (`Chassi`)**

- Seguindo padrão ISO 3779:2009 (VIN - Vehicle Identification Number)
- Exatamente 17 caracteres alfanuméricos
- Caracteres permitidos: A-H, J-N, P-R, S-Z, 0-9 (exclui I, O, Q para evitar confusão)

#### **RENAVAM (`Renavam`)**

- Registro Nacional de Veículos Automotores
- Aceita formatos: 9 dígitos (antigo) ou 11 dígitos (atual)
- Validação numérica

### Vantagens da Abordagem

✅ **Encapsulamento**: Regras de validação centralizadas e reutilizáveis  
✅ **Imutabilidade**: Value Objects garantem consistência dos dados  
✅ **Manutenibilidade**: Mudanças em regulamentações afetam apenas os VOs  
✅ **Testabilidade**: Unidades pequenas e focadas, fáceis de testar  
✅ **Expressividade**: Código autodocumentado através dos tipos de domínio

## 🛠️ Stack Tecnológica

- **Framework**: NestJS 10.x
- **Linguagem**: TypeScript 5.x
- **ORM**: MikroORM (MongoDB driver)
- **Banco de Dados**: MongoDB
- **Validação**: class-validator, class-transformer
- **Testes**: Jest (unitários e E2E)

### Por que MongoDB?

- ✅ Fácil configuração com Docker para ambientes de desenvolvimento e teste
- ✅ Flexibilidade para evolução do schema
- ✅ Boa performance para operações CRUD
- ✅ Suporte nativo do MikroORM

## 🧪 Testes

### Testes Unitários

Cobertura das regras de negócio nos Value Objects e lógica de serviços:

```bash
npm run test
```

### Testes E2E

Testes de integração validando o comportamento completo da API, incluindo limites do ORM:

```bash
npm run test:e2e
```

> **⚠️ Nota**: Os testes E2E estão em desenvolvimento e serão expandidos para cobrir cenários de:
>
> - Validação de constraints únicos (placa, chassi, renavam)
> - Comportamento de soft delete
> - Paginação e filtros
> - Casos extremos do ORM

## 🚀 Começando

### Pré-requisitos

- Node.js 24+
- Docker e Docker Compose
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Subir banco de dados
npm run services:up

# Iniciar aplicação
npm run start:dev
```

### Variáveis de Ambiente

```env
TZ=UTC
PORT=4000
NODE_ENV=development
DATABASE_URL=mongodb://mongodb:mongodb@localhost:27017/vehicle_db?authSource=admin
LOG_LEVEL=info
```

## 🔒 Validações Implementadas

- ✅ UUIDv7 para IDs (ordenação temporal nativa)
- ✅ Validação de formatos de placa (Mercosul e antigo)
- ✅ Validação de chassi segundo ISO 3779:2009
- ✅ Validação de RENAVAM (9 ou 11 dígitos)
- ✅ Unicidade de placa, chassi e renavam
- ✅ Soft delete para manutenção de histórico
- ✅ Body vazio retorna erro apropriado no PATCH

## 🎯 Melhorias Futuras

- [ ] Implementar dígito verificador do RENAVAM
- [ ] Adicionar autenticação e autorização (JWT)
- [ ] Expandir testes E2E
