# OnlyCation Frontend

OnlyCation es una plataforma educativa que conecta estudiantes con tutores especializados. Este es el frontend de la aplicación desarrollado con React, TypeScript, TailwindCSS y Vite.

## 🚀 Características

- **Interfaz moderna**: Diseño limpio y responsivo con TailwindCSS
- **Navegación fluida**: Implementado con React Router DOM
- **Componentes reutilizables**: Arquitectura modular y escalable
- **TypeScript**: Tipado estático para mayor robustez
- **Desarrollo rápido**: Hot Module Replacement con Vite

## 📋 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)

## 🛠️ Instalación

1. **Clona el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd OnlyCation_frontend
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

## 🚀 Ejecución del proyecto

### Modo desarrollo
Para ejecutar el proyecto en modo desarrollo con hot reload:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173`

### Construcción para producción
Para crear una versión optimizada para producción:

```bash
npm run build
```

### Vista previa de la construcción
Para previsualizar la versión de producción:

```bash
npm run preview
```

### Linting
Para ejecutar el linter y verificar el código:

```bash
npm run lint
```

## 📁 Estructura del proyecto

```
src/
├── app/
│   └── router.tsx          # Configuración de rutas
├── components/
│   ├── Header.tsx          # Componente del header
│   ├── Footer.tsx          # Componente del footer
│   ├── Button.tsx          # Componente de botón reutilizable
│   └── Card.tsx            # Componente de tarjeta reutilizable
├── pages/
│   ├── Home.tsx            # Página principal
│   ├── VerMas.tsx          # Página de tutores
│   ├── SobreNosotros.tsx   # Página sobre nosotros
│   └── SerDocente.tsx      # Página para ser docente
├── context/
│   ├── AuthContext.tsx     # Contexto de autenticación
│   └── ThemeContext.tsx    # Contexto de tema
├── assets/                 # Recursos estáticos
├── App.tsx                 # Componente principal
└── main.tsx               # Punto de entrada
```

## 🎨 Tecnologías utilizadas

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Vite** - Herramienta de construcción y desarrollo
- **TailwindCSS** - Framework de CSS utilitario
- **React Router DOM** - Enrutamiento del lado del cliente
- **ESLint** - Linter para mantener calidad del código

## 🎯 Rutas disponibles

- `/` - Página principal (Home)
- `/ver-mas` - Lista de tutores disponibles
- `/sobre-nosotros` - Información sobre la plataforma
- `/ser-docente` - Información para convertirse en tutor

## 🎨 Paleta de colores

El proyecto utiliza una paleta de colores personalizada definida en `tailwind.config.js`:

- **soft-white**: #FAF9F5 (Fondo principal)
- **mint-green**: #8ED4BE (Acentos y botones)
- **pastel-yellow**: #FFDE97 (Bordes y destacados)
- **petroleum-blue**: #294954 (Texto principal y navegación)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios siguiendo Conventional Commits:
   ```bash
   git commit -m "feat: Agregar nueva funcionalidad para X"
   ```
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convención de Commits

Seguimos la convención de **Conventional Commits** para mantener un historial claro:

- `feat:` → cuando agregas una nueva característica
- `fix:` → cuando corriges un bug
- `docs:` → cuando actualizas documentación
- `style:` → cambios de formato (espacios, puntos y comas, etc.)
- `refactor:` → reestructuración de código sin cambiar funcionalidad
- `test:` → cuando agregas o corriges pruebas
- `chore:` → tareas varias (build, configs, etc.)

**Ejemplos:**
```bash
git commit -m "feat: agregar página de perfil de usuario"
git commit -m "fix: corregir navegación en header"
git commit -m "docs: actualizar README con instrucciones"
git commit -m "style: aplicar formato consistente en componentes"
```

## 📝 Notas de desarrollo

- El proyecto utiliza **Vite** como bundler para un desarrollo más rápido
- **TailwindCSS** está configurado con colores personalizados
- Los componentes están diseñados para ser reutilizables y modulares
- Se implementa **React Router** para navegación SPA (Single Page Application)

## 🐛 Solución de problemas

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de que las dependencias estén instaladas: `npm install`

### Errores de TypeScript
- Ejecuta el linter: `npm run lint`
- Verifica que todas las importaciones sean correctas

### Problemas de navegación
- Asegúrate de que React Router DOM esté instalado
- Verifica que las rutas estén correctamente definidas en `router.tsx`
