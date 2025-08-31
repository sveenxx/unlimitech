## Unlimitech

### Podgląd online

[unlimitech-kappa.vercel.app](https://unlimitech-kappa.vercel.app)

## Wymagania

- Node.js 18 lub nowszy (LTS zalecany)
- Menedżer pakietów: pnpm (zalecany) lub npm/yarn

## Instalacja zależności

```bash
pnpm install
# lub
npm install
# lub
yarn install
```

## Uruchomienie w trybie deweloperskim

```bash
pnpm dev
# lub
npm run dev
# lub
yarn dev
```

Domyślnie serwer Vite wystartuje na `http://localhost:5173/`.

## Budowa wersji produkcyjnej

```bash
pnpm build
# lub
npm run build
# lub
yarn build
```

## Podgląd zbudowanej aplikacji lokalnie

```bash
pnpm preview
# lub
npm run preview
# lub
yarn preview
```

Domyślnie podgląd działa na `http://localhost:4173/`.

## Skrypty

- `dev`: uruchamia serwer deweloperski Vite
- `build`: buduje aplikację do `dist/`
- `preview`: uruchamia lokalny serwer podglądu builda

## Struktura projektu (skrót)

```text
.
├─ index.html
├─ assets/
│  ├─ js/
│  │  └─ app.js
│  ├─ less/
│  │  ├─ main.less
│  │  ├─ variables.less
│  │  └─ ...
│  └─ images/ …
├─ dist/                # pliki produkcyjne po `pnpm build`
├─ vite.config.js
├─ package.json
└─ pnpm-lock.yaml
```

## Notatki

- Główne style: `assets/less/` (wejściowe `main.less` i zmienne w `variables.less`).
- Logika JS: `assets/js/app.js`.
- Pliki wynikowe po buildzie: `dist/`.


