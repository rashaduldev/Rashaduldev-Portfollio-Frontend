Local run instructions — Rashaduldev-Portfollio-Frontend

Prerequisites
- Node.js (v18+ recommended)
- pnpm (used in this project) or npm/yarn if you prefer
- Backend running (set NEXT_PUBLIC_API_URL accordingly)

Environment
- Create a `.env.local` at the project root with:

NEXT_PUBLIC_API_URL=http://localhost:5000

(Replace with your backend URL.)

Install & run (local)
```bash
cd Rashaduldev-Portfollio-Frontend
pnpm install    # run locally if you need to install deps
pnpm dev
```

Notes
- The frontend fetches articles from `${NEXT_PUBLIC_API_URL}/api/articles` and related endpoints.
- Article details page is hydrated with server-side fetch; if you run the backend locally, ensure CORS allows the frontend origin.
- If PowerShell blocks scripts on Windows, run once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

If you prefer npm:

```bash
npm install
npm run dev
```

If you want, I can commit changes and open a PR; tell me when you're ready and I'll run the commit step.