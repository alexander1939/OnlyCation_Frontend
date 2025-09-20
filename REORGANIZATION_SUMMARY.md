# Reorganización de la Lógica de Autenticación

## Resumen de Cambios

Se ha reorganizado exitosamente la lógica de autenticación separando las responsabilidades entre las carpetas `context` y `hooks` como se solicitó.

## Nueva Estructura

### 📁 `src/context/auth/`
**Contiene las variables de contexto y tipos:**
- `types.ts` - Interfaces y tipos para autenticación
- `AuthContext.tsx` - Proveedor de contexto de autenticación
- `index.ts` - Exportaciones del módulo auth context

### 📁 `src/hooks/auth/`
**Contiene las peticiones API y lógica de hooks:**
- `useAuthApi.ts` - Hook para llamadas a la API de autenticación
- `useAuth.ts` - Hook principal que maneja el estado de autenticación
- `index.ts` - Exportaciones del módulo auth hooks

## Funcionalidades Migradas

### Del archivo `authService.ts` se separó:

**A `context/auth/`:**
- Tipos e interfaces (User, AuthState, RegisterRequest, LoginResponse, etc.)
- Contexto de autenticación con React Context API

**A `hooks/auth/`:**
- Llamadas API (login, logout, register, password reset)
- Manejo de tokens y localStorage
- Estado de autenticación
- Lógica de refresh token

## Archivos Actualizados

### Páginas de registro:
- `Register.tsx` - Actualizado para usar `useAuthContext`
- `RegisterStudent.tsx` - Actualizado para usar `useAuthContext`  
- `RegisterTeacher.tsx` - Actualizado para usar `useAuthContext`

### Índices de módulos:
- `src/context/index.ts` - Exporta el nuevo auth context
- `src/hooks/index.ts` - Exporta los nuevos auth hooks

## Beneficios de la Reorganización

1. **Separación clara de responsabilidades:**
   - Context: Variables de estado y tipos
   - Hooks: Peticiones API y lógica de negocio

2. **Mejor organización del código:**
   - Estructura modular por funcionalidad
   - Fácil mantenimiento y escalabilidad

3. **Reutilización mejorada:**
   - Hooks específicos para diferentes necesidades
   - Contexto centralizado para el estado global

4. **Arquitectura más limpia:**
   - Siguiendo patrones de React modernos
   - Separación entre presentación y lógica

## Uso

```tsx
// Para usar el contexto de autenticación
import { useAuthContext } from '../context/auth';

// Para usar hooks específicos de API
import { useAuthApi } from '../hooks/auth';
```

La reorganización mantiene toda la funcionalidad existente mientras mejora la estructura y mantenibilidad del código.
