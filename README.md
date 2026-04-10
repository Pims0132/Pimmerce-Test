# Pimmerce — Next.js

## Installeren

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment variables

Kopieer `.env.local.example` naar `.env.local` en vul in:

```
SUPABASE_URL=           # Supabase project URL
SUPABASE_SERVICE_KEY=   # Supabase service_role key
RESEND_API_KEY=         # Resend API key
RESEND_TO_EMAIL=        # Jouw eigen emailadres voor notificaties
```

## Foto

Zet `Pim-pimmerce.jpg` in `/public/images/`

## Deployen op Vercel

1. Push naar GitHub
2. Importeer project in Vercel
3. Voeg environment variables toe in Vercel dashboard
4. Deploy

## Supabase tabel aanmaken

```sql
create table contacten (
  id          bigint generated always as identity primary key,
  naam        text not null,
  email       text not null,
  bedrijf     text,
  dienst      text,
  bericht     text,
  aangemaakt  timestamptz default now()
);
```
