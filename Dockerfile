# 1️⃣ Imagen base: Node LTS
FROM node:20-alpine AS build

# 2️⃣ Directorio de trabajo dentro del contenedor
WORKDIR /app

# 3️⃣ Copiar package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# 4️⃣ Instalar dependencias
RUN npm install

# 5️⃣ Copiar el resto del proyecto
COPY . .

# 6️⃣ Construir la app para producción
RUN npm run build

# --- Etapa final: servir la app con Nginx ---
FROM nginx:stable-alpine

# Copiar build de React al contenedor de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración de Nginx (opcional, si quieres custom)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Arrancar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
