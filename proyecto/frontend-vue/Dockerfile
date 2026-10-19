# Imagen del frontend en Vue del proyecto integrador.
# Etapa 1: Node construye la aplicación (npm run build deja los archivos listos en dist).
# Etapa 2: nginx sirve esos archivos y pasa las peticiones de /api a la API.

# ---- Etapa 1: construir ----
FROM node:24-alpine AS construccion
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Etapa 2: servir ----
FROM nginx:alpine
# La configuración de nginx de este proyecto reemplaza la que trae la imagen
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Solo se copian los archivos ya construidos; Node y el código fuente se quedan en la etapa 1
COPY --from=construccion /app/dist /usr/share/nginx/html
EXPOSE 80
