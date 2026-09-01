# Vercel deployment notes

This project is a Vite + React + Express application with Vercel Node.js Functions under `api/`.

## What was fixed

- Vercel API imports now use explicit `.js` ESM specifiers so Node can resolve the compiled modules.
- Vercel Functions are configured to use the Node.js runtime and include the server-side source tree used by the API functions.
- The web server bundle is built as ESM, removing the previous `import.meta`/CommonJS warning.
- `.env.local`, `node_modules`, and `dist` remain excluded by `.gitignore`.

## Local

```powershell
npm install
npm run dev
```

The local Express server uses port 3000. If another process is already using it, stop that process first.

## Vercel

Add the real production environment variables in Vercel Project Settings → Environment Variables. Do not commit `.env.local` to GitHub.

After pushing the project to GitHub, deploy/redeploy on Vercel.

Test the API directly after deployment:

```text
https://YOUR-DOMAIN.vercel.app/api/content
```

A successful response is JSON with `success: true`. If a provider has an API/permission problem, the individual provider sync is isolated and the response can still contain data from providers that succeeded.
