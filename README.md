# Yupii Personalizados e Festas

Aplicação web para gestão de clientes, orçamentos e catálogo de pacotes/temas.

## Stack

- Frontend: HTML/CSS/JS puro
- Backend: Node.js + Express (`server.js`)
- Banco de dados: Neon (Postgres)
- Hospedagem: Render

## 1. Configurar o banco no Neon

1. Crie um projeto em https://neon.tech
2. Abra o **SQL Editor** e execute o conteúdo de `schema.sql`
3. Copie a *connection string* (Dashboard > Connection Details):
   ```
   postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require
   ```

## 2. Subir para o GitHub

```bash
git init
git add .
git commit -m "Yupii - app com Express e Neon"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

## 3. Deploy no Render

1. Acesse https://render.com → **New** → **Web Service**
2. Conecte sua conta do GitHub e selecione o repositório
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Em **Environment**, adicione a variável:
   - `DATABASE_URL` = (connection string do Neon)
5. Clique em **Create Web Service**

O Render vai instalar as dependências, iniciar o `server.js`, que serve o frontend e as rotas `/api/clients`, `/api/themes`, `/api/quotes`.

## 4. Testar localmente (opcional)

```bash
npm install
```

Crie um arquivo `.env` com:
```
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require
```

E rode:
```bash
node -r dotenv/config server.js
```
(ou instale `dotenv` com `npm install dotenv` para carregar o `.env` automaticamente)

## Observações de segurança

- Troque a senha de acesso fixa (`ACCESS_PASSWORD` em `script.js`) por uma autenticação real antes de usar em produção.
- Nunca commite o `.env` ou a connection string do Neon no repositório.
