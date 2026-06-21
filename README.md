# Yupii Personalizados e Festas

Aplicacao web para gestao de clientes, orcamentos, catalogo de pacotes e agenda de eventos.

## Stack

- Frontend: HTML, CSS e JavaScript puro
- Backend: Node.js + Express
- Banco em producao: Postgres/Neon via `DATABASE_URL`
- Hospedagem: Render

## Rodar no Render

No Render, configure o Web Service com:

```bash
Build Command: npm install
Start Command: npm start
```

Em **Environment**, configure:

```bash
DATABASE_URL=sua_connection_string_do_neon
APP_ADMIN_PASSWORD=sua_senha_admin
APP_USER_PASSWORD=sua_senha_usuario
AUTH_SESSION_SECRET=uma_chave_grande_aleatoria
```

O comando `npm start` executa:

```bash
node server.js
```

Esse servidor entrega o frontend e as rotas:

```text
/api/clients
/api/themes
/api/quotes
```

## Banco de dados

Execute o arquivo `schema.sql` no Neon ou no Postgres usado em producao.

Tabelas esperadas:

```text
clients
themes
quotes
```

Cada tabela armazena os dados em uma coluna `data` do tipo `JSONB`.

## Subir para o GitHub

```bash
cd /c/Users/lucas/OneDrive/Desktop/yupii_orcamento
git init
git add .
git commit -m "Atualiza app Yupii"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

Se o repositorio ja existir localmente:

```bash
git add .
git commit -m "Atualiza app Yupii"
git push
```

## Teste local opcional sem Neon

Para testar localmente sem banco externo:

```bash
npm install
npm run local
```

Abra:

```text
http://localhost:3000
```

O modo local salva os dados em `.local-db.json`, que esta no `.gitignore`.

## Observacoes

- Nao suba `.env`, `.env.local` ou connection string para o GitHub.
- O Render precisa da variavel `DATABASE_URL` para salvar dados no banco real.
- As senhas de acesso devem ficar somente nas variaveis `APP_ADMIN_PASSWORD` e `APP_USER_PASSWORD`.
- Use `AUTH_SESSION_SECRET` com uma chave longa e aleatoria para assinar as sessoes.
