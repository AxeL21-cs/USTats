# USTats Tech Stack

## Core Application

- **React 19.2.3** - UI framework for the single-page application.
- **React DOM 19.2.3** - Browser rendering for React.
- **Vite 7.3.0** - Development server, bundler, and production build tool.
- **JavaScript / JSX** - Main application language and component format.
- **CSS** - Custom styling, responsive layout, design tokens, and visual system.

## Data Visualization

- **Recharts 3.5.1** - Charts for grade trends, subject comparison bars, semester averages, and Latin honor progress gauges.

## Icons and UI Elements

- **lucide-react 0.561.0** - Icon library used for navigation, actions, upload controls, alerts, logout, reset/delete buttons, and dashboard indicators.
- **Custom CSS Components** - App shell, nav, panels, tables, forecast banners, status badges, honor cards, gauges, upload previews, and responsive states.

## State and Persistence

- **React `useState`** - Local UI and workflow state.
- **React `useMemo`** - Derived data for parsed curriculum and college lists.
- **Browser `localStorage`** - Persists student name, active page, semesters, grades, selected college/course, calculator components, and app state across refreshes.
- **FileReader API** - Reads uploaded grade screenshots and grading-system screenshots for local preview.

## Local Data Sources

- **`UST_COLLEGES.md`** - Local markdown file containing UST colleges/faculties for the searchable college selector.
- **`COMPSCI_UST.md`** - Local markdown curriculum source for UST Computer Science, including subject codes, descriptions, lecture units, lab units, prerequisites, and Latin honors exclusions.
- **Markdown raw imports via Vite** - Loads `.md` files into the client app using `?raw`.

## Calculations and Logic

- **Client-side grade computation** - No backend; all grade, safety, and honors logic runs in the browser.
- **UST-style semestral average** - Uses Finals as the official final grade, weights by lecture + lab units, and excludes NSTP where applicable.
- **Safety / risk forecasting** - Uses grade bands, at-risk counts, watch-zone subjects, semestral average, and safety score.
- **Latin honors forecasting** - Uses curriculum units, completed units, remaining units, remaining semesters, current weighted GWA, tier requirements, reachability checks, and required remaining average.
- **Subject target calculator** - Computes required future assessment scores from weighted grading components and desired grade.

## Assets

- **PNG logo assets**
  - `public/assets/ustats-logo.png`
  - `public/assets/ustats-logo-transparent.png`
- **Static public assets through Vite** - Served from the `public/` directory.

## Build and Package Management

- **npm** - Package manager and script runner.
- **package-lock.json** - Locked dependency versions for repeatable installs.
- **Build command** - `npm run build`
- **Dev command** - `npm run dev`
- **Preview command** - `npm run preview`

## Deployment and Hosting

- **Vercel** - Production hosting for the deployed Vite app.
- **Vercel CLI via `npx vercel`** - Used for deployment from the local project.
- **Live production URL** - `https://ustats-tawny.vercel.app`

## Version Control

- **Git** - Local version control.
- **GitHub** - Remote repository hosting.
- **Repository** - `https://github.com/AxeL21-cs/USTats.git`
- **Main branch** - `main`

## Browser Support Target

- **Modern desktop and tablet browsers**
- Responsive layouts are handled with CSS grid/flexbox and media queries.

## Not Used

- No backend server.
- No database.
- No authentication provider.
- No OCR service yet; uploads are previewed locally with manual entry fallback.
- No TypeScript.
- No external CSS framework such as Tailwind or Bootstrap.
