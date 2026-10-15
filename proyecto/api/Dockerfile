# Imagen de Docker de la API del proyecto integrador.
# Se construye y se prende con: docker compose up -d --build (ver compose.yaml)

# Imagen base: Node.js 24 sobre Alpine, una versión de Linux muy liviana
FROM node:24-alpine

# Carpeta donde queda la API dentro del contenedor
WORKDIR /app

# Primero se copian package.json y package-lock.json y se instalan las librerías.
# --omit=dev deja por fuera las que solo se usan para las pruebas (supertest).
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Después se copia el código de la API
COPY src ./src

# La API no corre como administrador del contenedor, sino con el usuario node
USER node

# Puerto en el que escucha la API dentro del contenedor
EXPOSE 3000

# Comando que prende la API. Las variables de entorno las pasa Docker desde compose.yaml,
# por eso aquí no se usa --env-file=.env
CMD ["node", "src/index.js"]
