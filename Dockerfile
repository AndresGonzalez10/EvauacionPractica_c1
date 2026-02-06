# Usamos Node.js versión ligera
FROM node:20-alpine

# Carpeta de trabajo adentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las librerías
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto 3000
EXPOSE 3000

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev"]