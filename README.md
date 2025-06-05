🧾 API e-commerce, Pedidos e Itens – NestJS + Prisma
Esta é uma API desenvolvida com NestJS, Prisma ORM e SQLite, estruturada para gerenciar produtos, pedidos e itens dos pedidos, com validação de dados usando Zod.
Um e-commerce bem estruturado com todas as validações de rotas e respostas adequadas as requisições.

- **API GERA DOCUMENTAÇÂO ATRAVÈS DO SWAGGER**
- **APÒS RODAR A APLICAÇÂO, ACESSAR <http://localhost:3000/api>**

---

🚀 Funcionalidades
- Criar, atualizar, buscar e deletar produtos

- Criar pedidos associados a usuários

- Adicionar itens aos pedidos

- Buscar pedidos por usuário

- Buscar itens por pedido ou produto

- Validação de dados com Zod

- Manipulação de erros estruturada

---

📦 Tecnologias e Dependências
- NestJS

- Prisma ORM

- SQLite

- Zod

- @nestjs/common

- @prisma/client

- ts-node-dev (ambiente de desenvolvimento)

---

🛠️ Instalação
1. Clone o repositório

```bash
git clone https://github.com/reinaldoper/e-commerce.git
cd e-commerce
npm install
```

---

2. Configure o banco de dados
- Crie um .env com DATABASE_URL="file:./dev.db"

---

3. Configure o Prisma
- Gere o cliente Prisma e crie as tabelas no banco:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

4. ▶️ Rodando o projeto

```bash
npm run start:dev
```

---

5. 📁 Estrutura do Projeto

```bash
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── itens
│   │   ├── dto.itens.ts
│   │   ├── itens.controller.ts
│   │   ├── itens.module.ts
│   │   └── itens.service.ts
│   ├── main.ts
│   ├── orders
│   │   ├── dto.orders.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.module.ts
│   │   └── orders.service.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── products
│   │   ├── dto.products.ts
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   └── products.service.ts
│   └── users
│       ├── dto.users.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       └── users.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
```

---

📌 Endpoints
- Produtos /products

| Método | Rota            | Descrição                    |
| ------ | --------------- | ---------------------------- |
| POST   | `/create`       | Cria um produto              |
| PUT    | `/update/:id`   | Atualiza um produto          |
| GET    | `/find/:id`     | Busca um produto por ID      |
| GET    | `/search/:title` | Busca produtos pelo tittulo |
| GET    | `/all`          | Lista todos os produtos      |
| DELETE | `/delete/:id`   | Deleta um produto            |

- Pedidos /orders

| Método | Rota            | Descrição                       |
| ------ | --------------- | ------------------------------- |
| POST   | `/create`       | Cria um pedido                  |
| GET    | `/user/:userId` | Lista pedidos por ID de usuário |
| GET    | `/:id`          | Busca um pedido por ID          |
| PUT    | `/update/:id`   | Atualiza um pedido              |
| DELETE | `/delete/:id`   | Deleta um pedido                |

- Itens /itens

| Método | Rota                  | Descrição               |
| ------ | --------------------- | ----------------------- |
| POST   | `/create`             | Cria um item            |
| GET    | `/order/:orderId`     | Busca itens por pedido  |
| GET    | `/product/:productId` | Busca itens por produto |
| GET    | `/:id`                | Busca item por ID       |
| PUT    | `/update/:id`         | Atualiza item           |
| DELETE | `/delete/:id`         | Deleta item             |

- Users /users

| Método | Rota                | Descrição                        |
| ------ | ------------------- | -------------------------------- |
| POST   | `/users/register`   | Criação de um novo usuário       |
| PUT    | `/users/update/:id` | Atualização dos dados do usuário |
| POST   | `/users/login`      | Autenticação (login)             |
| GET    | `/users/find/:id`   | Busca de um usuário por ID       |
| GET    | `/users/all`        | Listagem de todos os usuários    |
| DELETE | `/users/delete/:id` | Exclusão de um usuário           |


---

📘 Scripts

```bash
# Rodar servidor em modo dev
npm run start:dev

# Rodar build
npm run build

# Rodar servidor em modo produção
npm run start:prod

# Rodar migrations
npx prisma migrate dev

# Gerar cliente prisma
npx prisma generate
```


🧑‍💻 Autor
- Reinaldo Pereira dos Santos
📍 Dourados - MS
🔗 GitHub: reinaldoper
