FROM node:20-alpine

# Installez dockerize ou un outil similaire
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Définissez le répertoire de travail
WORKDIR /usr/src/app

# Copiez les fichiers du package et installez les dépendances
COPY package*.json ./

RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel votre application s'exécute
EXPOSE 3000

CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "20s", "npm", "run", "start:prod"]

