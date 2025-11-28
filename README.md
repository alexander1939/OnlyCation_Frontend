# OnlyCation Frontend (PWA)

Frontend de OnlyCation creado con React + TypeScript + Vite. La aplicación está configurada como PWA mediante `vite-plugin-pwa`.

## Tabla de contenido
- Introducción breve
- Instalación y ejecución
- Evidencias solicitadas
  - Configuración del host virtual (HTTP/HTTPS)
  - Configuración del proyecto y rutas (framework)
  - Configuración del manifiesto (manifest.json)
  - Configuración del service worker (serviceworker.js / equivalente)

---

## Introducción breve
Esta SPA utiliza `vite-plugin-pwa` para habilitar instalación, funcionamiento offline con `offline.html` y caché de recursos. Las rutas se manejan con React Router v7.

## Instalación y ejecución
```bash
# Instalar dependencias
npm install

# Desarrollo (HTTP en localhost:5173)
npm run dev

# Build producción
npm run build

# Vista previa del build
npm run preview
```

---

## Evidencias solicitadas

### 1) Configuración del host virtual (HTTP/HTTPS)

- Explicación
  - En desarrollo, el servidor de Vite expone la app por HTTP en `localhost:5173`. No se requiere HTTPS para probar PWA en `localhost`.
  - Para instalar la PWA en la mayoría de navegadores en producción, el sitio debe servirse por HTTPS. Esta habilitación se realiza en el servidor/proxy (fuera del código del frontend). No hay archivos de configuración de virtual host/HTTPS dentro de este repo.
  - Equivalente en este proyecto: la sección `server` de `vite.config.ts` define host y puerto en desarrollo (HTTP), sin HTTPS.

- Evidencia (archivo `vite.config.ts`):
```ts
export default defineConfig({
  plugins: [react(), VitePWA({ /* ... */ })],
  server: {
    host: 'localhost',
    port: 5173,
    // HTTPS disabled for local development as requested
  },
})
```

- Nota: No existe `nginx.conf` o similar en el repo. Para producción, basta servir el contenido generado (`dist/`) detrás de HTTPS (reverse proxy o plataforma de hosting). La PWA funciona sin HTTPS solo en `localhost` durante el desarrollo.

---

### 2) Configuración del proyecto y rutas (framework)

- Explicación
  - Framework: React 19 + Vite 7, enrutamiento con React Router v7.
  - Las rutas se definen con `createBrowserRouter` en `src/app/router.tsx` y se inyectan con `RouterProvider`.

- Evidencias
  - Dependencias (archivo `package.json`):
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.8.2"
  },
  "devDependencies": {
    "vite": "^7.1.2",
    "vite-plugin-pwa": "^1.1.0"
  }
}
```
  - Rutas (archivo `src/app/router.tsx`, extracto):
```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/teachers', element: <AllTeachers /> },
  { path: '/about-us', element: <AboutUs /> },
  { path: '/be-teacher', element: <BeTeacher /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  // ...rutas privadas y páginas de error
]);

export default function AppRouter() {
  return (
    <GlobalErrorBoundary>
      <RouterProvider router={router} />
    </GlobalErrorBoundary>
  );
}
```

---

### 3) Configuración del manifiesto (manifest.json)

- Explicación
  - El `manifest.json` se sirve desde `public/manifest.json` y se enlaza en `index.html`.
  - Adicionalmente, `vite-plugin-pwa` define un manifest en `vite.config.ts` que se utiliza al construir el proyecto (build). Ambos enfoques son válidos; se puede unificar si se desea.

- Evidencias
  - Enlace al manifest (archivo `index.html`):
```html
<link rel="manifest" href="/manifest.json" />
```
  - Contenido del manifest (archivo `public/manifest.json`, extracto):
```json
{
  "name": "OnlyCation",
  "short_name": "OnlyCation",
  "description": "Plataforma educativa para conectar estudiantes con los mejores profesores",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAF9F5",
  "theme_color": "#8ED4BE",
  "icons": [
    { "src": "logo.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any maskable" },
    { "src": "logo.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```
  - Manifest definido por el plugin (archivo `vite.config.ts`, extracto):
```ts
VitePWA({
  manifest: {
    name: 'OnlyCation',
    short_name: 'OnlyCation',
    description: 'Plataforma educativa para conectar estudiantes con los mejores profesores',
    theme_color: '#8ED4BE',
    background_color: '#FAF9F5',
    display: 'standalone',
    start_url: '/',
    icons: [
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
    ]
  }
})
```

---

### 4) Configuración del service worker (serviceworker.js)

- Explicación
  - No existe un `serviceworker.js` manual en el repo. El service worker es generado automáticamente por `vite-plugin-pwa` (usa Workbox). La configuración del SW está en `vite.config.ts`.
  - Durante el desarrollo, los archivos del SW se crean bajo `dev-dist/`. En producción, se generan en el build final (`dist/`) y están ignorados por git.

- Evidencias
  - Configuración del SW (archivo `vite.config.ts`, extracto):
```ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,json}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: { cacheName: 'google-fonts-cache' }
      },
      {
        urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
        handler: 'CacheFirst',
        options: { cacheName: 'images-cache' }
      },
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'html-cache' }
      },
      {
        urlPattern: /\/api\//i,
        handler: 'NetworkOnly',
        method: 'POST',
        options: {
          backgroundSync: { name: 'onlycation-api-queue', options: { maxRetentionTime: 24 * 60 } }
        }
      }
    ]
  },
  devOptions: { enabled: true, type: 'module', navigateFallback: 'offline.html' }
})
```
  - Archivos generados del SW ignorados por git (archivo `.gitignore`):
```gitignore
public/sw.js
public/workbox-*.js
public/registerSW.js
dev-dist/sw.js
dev-dist/workbox-*.js
dev-dist/registerSW.js
```
  - Página de fallback offline (archivo `public/offline.html`, extracto):
```html
<h1>Estás sin conexión</h1>
<a class="btn" href="/">Reintentar</a>
```

- Registro del SW
  - El registro es gestionado automáticamente por el plugin (autoUpdate). No se usa el registro manual en `src/main.tsx` (está comentado).

---

Si deseas que unifiquemos el manifest (dejar solo el de `public/manifest.json` o solo el del plugin), o que agreguemos una frase estándar sobre HTTPS para documentación académica, te lo preparo en seguida.
