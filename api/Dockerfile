# FROM node:latest
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD ["node", "app.js"]

# Utilisez l'image de base officielle de Node.js
FROM node:latest

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

# Utilisez dockerize pour attendre qp.jsue MySQL soit prêt avant de démarrer l'application Node.js

#CMD sh -c 'dockerize -wait tcp://db:3306 -timeout 20s && nodemon -L /usr/src/app/app.js'
# CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "20s", "node", "/usr/src/app/dist/main.js"]
# CMD [ "npm", "run", "start:dev" ]
CMD ["dockerize", "-wait", "tcp://db:3306", "-timeout", "20s", "npm", "run", "start:prod"]
