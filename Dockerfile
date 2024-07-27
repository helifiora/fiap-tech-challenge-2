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

# Compilar o código TypeScript
RUN npm run build

# Copiar os scripts de entrada para o contêiner
COPY entrypoint.sh .

# Dar permissão de execução aos scripts de entrada
RUN chmod +x entrypoint.sh

# Expor a porta em que a aplicação irá rodar
EXPOSE 3000

# Usar o script de entrada como ponto de entrada do contêiner
ENTRYPOINT ["./entrypoint.sh"]