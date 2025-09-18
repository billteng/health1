# Patient Dashborad

This workspace contains a scaffold for a patient management system:

- backend: Express + TypeScript + MySQL
- frontend: Vite + React + TypeScript
- mobile: Expo (React Native) minimal scaffold
- docker-compose.yml: runs MySQL and Adminer and initializes the `patients` table

Quick start (requires Docker):

1. Start MySQL and Adminer:

```bash
cd health1
docker compose up -d
```

2. Backend:

- Copy `.env.example` to `.env` in `health1/backend` and adjust if needed.
- From `health1/backend` run:

```bash
npm install
npm run dev
```

- Test Url: http://localhost:4000/api/patients

3. Frontend:

- From `health1/frontend` run:

```bash
npm install
npm run dev
```

- Test Url: http://localhost:5173/

4. Mobile (optional):

- From `health1/mobile` run:

```bash
npm install
npx expo start
```

Notes and next steps:

- This scaffold focuses on code quality and UI/UX readiness; components are intentionally simple and typed.
- Let me know if you want authentication, validation, migrations, Dockerfile for backend, or CI config.
