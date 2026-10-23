# SatwikOS

An interactive developer portfolio for [Satwik934](https://github.com/Satwik934): animated canvas wireframe tunnel, code-file explorer, simulated terminal, live GitHub project cards, and editable developer diary.

## Requirements
- Node.js 20.9+ (Node 22 LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Customize

- `app/page.tsx`: hero text, navigation, footer, GitHub username in API request.
- `components/Workspace.tsx`: code snippets, terminal commands, file tabs, GitHub link.
- `lib/diary.ts`: replace the clearly marked sample diary entries with your own logs.
- `app/globals.css`: theme, spacing, animations.
- `components/Tunnel.tsx`: tunnel geometry and animation speed.
- `app/layout.tsx`: page title and SEO metadata.

GitHub projects are fetched **server-side** from the public GitHub REST API, cached for 1 hour, and limited to six non-fork, non-archived repositories. If GitHub is unavailable or rate-limited, a link to the profile appears instead. No API token required for this basic public display. The terminal is an intentionally safe **command simulator**, not a shell or code executor.

## Deploy to Vercel

1. Create a new GitHub repository, e.g. `satwikos`.
2. Push this project's **contents** to the repository root (not the enclosing `satwikos` directory).
3. Sign in to https://vercel.com and choose **Add New → Project**.
4. Import your repository; Vercel should detect **Next.js** automatically.
5. Leave the build command as `next build` and deploy. No environment variables are needed.
6. After deployment, use your assigned `*.vercel.app` URL, or configure a custom domain.

Optional terminal commands for publishing (inside the project folder):

```bash
git init
git add .
git commit -m "Launch SatwikOS"
git branch -M main
git remote add origin https://github.com/Satwik934/satwikos.git
git push -u origin main
```

Create the remote repository on GitHub before running the last two commands. Replace the URL if you chose a different repository name.

## Accessibility / performance

The animated tunnel is drawn with a single HTML canvas (no heavyweight 3D dependency). Device pixel ratio is capped at 2. The animation respects `prefers-reduced-motion`. Buttons and links have focus states; the site is responsive.

## License

Personal portfolio starter. You may modify and publish it for your own use.

## Version 2 updates

- **Featured projects:** edit `lib/portfolio.ts` for GreenLens, StockFlow, and SiteTrack. Set each real repository or demo URL; replace the placeholder descriptions.
- **Experience:** the University of Toronto co-op (8 months) is highlighted on the homepage. Add your actual title, dates, and achievements in `components/Workspace.tsx` (search for `id="experience"`).
- **Browser editor:** choose a file and click EDIT, then SAVE. This persists to localStorage **only on that browser**. It does not modify source files or the deployed website for other visitors. To publish permanent changes, edit `components/Workspace.tsx` and commit the code. The terminal is a simulator, not a real Python/C/Java compiler.
- The project showcase still automatically fetches public GitHub repositories.
