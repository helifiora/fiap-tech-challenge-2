# Usar a imagem oficial do Node.js como base
FROM node:20

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copiar o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar todos os arquivos da aplicação para o diretório de trabalho
COPY . .

# Expor a porta em que a aplicação irá rodar
EXPOSE 3000

# Usar o script de entrada como ponto de entrada do contêiner
CMD ["npm", "run", "start"]