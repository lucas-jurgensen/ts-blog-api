
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js)

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)

![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)

![Zod](https://img.shields.io/badge/Zod-3.x-1E4C6F)

# Blog API

RESTful API desenvolvida para gerenciar postagens de blog e comentários, servindo como um backend completo para um sistema de blog simples. Ela permite:

- Criar, editar, listar e excluir postagens
- Adicionar, editar e remover comentários nas postagens
- Relacionar comentários com suas postagens correspondentes

A solução utiliza armazenamento em arquivos JSON, eliminando a necessidade de um banco de dados tradicional, o que a torna leve e fácil de configurar para projetos pequenos ou estudos.


# Instalação

**Pré-requisitos**
- Node.js (v18 ou superior)
- NPM ou Yarn

1. **Clone o repositório**

```bash
git clone https://github.com/lucas-jurgensen/ts-blog-api.git
```

2. **Instale as dependências** 


```bash
npm install
```

3. **Caso não tenha o arquivo .json, crie**


```bash
mkdir -p src/db
echo '[]' > src/db/posts.json
echo '[]' > src/db/comments.json
```


4. **Inicie o servidor**


```bash
npm run dev
```
O servidor esta rodando em `http://localhost:3000`



# Endpoints

## Posts

- `GET /api/posts` - Lista todas as postagens
- `GET /api/posts/:id` - Busca uma postagem específica
- `POST /api/posts` - Cria uma nova postagem
- `PUT /api/posts/:id` - Atualiza uma postagem
- `DELETE /api/posts/:id` - Remove uma postagem

## Comentários

- `GET /api/posts/:id/comments` - Lista comentários de uma postagem
- `POST /api/posts/:id/comments` - Adiciona um comentário
- `PUT /api/posts/:id/comments/:commentId` - Edita um comentário
- `DELETE /api/posts/:id/comments/:commentId` - Remove um comentário


# Status HTTP

| Código | Descrição                  |
|--------|----------------------------|
| 200    | OK - Sucesso               |
| 201    | Criado - Recurso criado    |
| 400    | Requisição inválida        |
| 404    | Não encontrado             |
| 500    | Erro interno do servidor   |

