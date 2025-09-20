# Configuración CORS para Backend OnlyCation APIs

## Problema
El proxy de Vite no está funcionando correctamente. Se cambió a conexión directa al backend, pero necesita configuración CORS.

## Solución: Configurar CORS en FastAPI

Agrega esta configuración en tu archivo principal del backend (probablemente `main.py` o donde inicializes la app FastAPI):

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuración CORS para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Puerto del frontend Vite
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Resto de tu configuración...
```

## Para Producción

En producción, cambia `allow_origins` por tu dominio real:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tu-dominio.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

## URLs Actuales del Frontend

El frontend ahora hace peticiones directas a:
- `http://localhost:8000/auth/register/student/`
- `http://localhost:8000/auth/register/teacher/`
- `http://localhost:8000/auth/login/`
- `http://localhost:8000/auth/logout/`

## Verificar Backend

Asegúrate de que tu backend esté corriendo en `http://localhost:8000` y que las rutas estén disponibles en `/auth/`.
