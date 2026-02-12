FROM node:18

WORKDIR /app

# Copier package.json du backend
COPY backend/package*.json ./

# Copier le dossier my_packages dans l'image
COPY my_packages ../my_packages

RUN npm install

# Copier le reste du backend
COPY backend .

EXPOSE 4000