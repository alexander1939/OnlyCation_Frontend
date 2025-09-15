# Configuración CORS - OnlyCation Frontend

## Problema Solucionado
Error de CORS al conectar frontend (puerto 5173) con backend (puerto 8000):
```
Access to fetch at 'http://localhost:8000/register/student/' from origin 'http://localhost:5173' has been blocked by CORS policy
```

## Solución Implementada

### 1. Proxy de Vite (Desarrollo)
Se configuró un proxy en `vite.config.ts` para redirigir las peticiones del frontend al backend:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
```

### 2. Actualización del AuthService
Se cambió la URL base en `authService.ts`:
```typescript
// Antes
const API_BASE_URL = 'http://localhost:8000';

// Después
const API_BASE_URL = '/api';
```

## Cómo Funciona

1. **Frontend** hace petición a `/api/register/student/`
2. **Vite proxy** intercepta la petición
3. **Redirige** a `http://localhost:8000/register/student/`
4. **Backend** responde normalmente
5. **Vite** devuelve la respuesta al frontend

## Para Producción

En producción, necesitarás configurar CORS en el backend FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tu-dominio.com"],  # URLs permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Reiniciar Servidor

**IMPORTANTE**: Después de cambiar `vite.config.ts`, debes reiniciar el servidor de desarrollo:

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar
npm run dev
```

## Verificación

Las peticiones ahora deberían funcionar correctamente:
- ✅ `/api/register/student/` → `http://localhost:8000/register/student/`
- ✅ `/api/register/teacher/` → `http://localhost:8000/register/teacher/`
- ✅ `/api/login/` → `http://localhost:8000/login/`
