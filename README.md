# Yupii Personalizados e Festas

Aplicação web para gestão de clientes, orçamentos e catálogo de pacotes/temas.

## Stack

- Frontend: HTML/CSS/JS puro
- Backend: Vercel Serverless Functions (`/api`)
- Banco de dados: Neon (Postgres)

## 1. Configurar o banco no Neon

1. Crie um projeto em https://neon.tech
2. Abra o **SQL Editor** e execute o conteúdo de `schema.sql`
3. Copie a *connection string* (Dashboard > Connection Details), algo como:
   ```
   postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require
   ```

## 2. Subir para o GitHub

```bash
git init
git add .
git commit -m "Yupii - app inicial com integração Neon"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/yupii.git
git push -u origin main
```

## 3. Deploy na Vercel

1. Acesse https://vercel.com → **New Project** → importe o repositório
2. Em **Settings → Environment Variables**, adicione:
   - `DATABASE_URL` = (connection string do Neon)
3. Deploy. A Vercel serve o frontend e as funções `/api/clients`, `/api/themes`, `/api/quotes` automaticamente

## 4. Testar localmente (opcional)

```bash
npm i -g vercel
npm install
vercel dev
```

Crie um arquivo `.env.local` com:
```
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require
```

## Observações de segurança

- Troque a senha de acesso fixa (`ACCESS_PASSWORD` em `script.js`) por uma autenticação real antes de usar em produção, já que os endpoints `/api/*` ficarão públicos.
- Nunca commite o `.env` ou a connection string do Neon no repositório.
