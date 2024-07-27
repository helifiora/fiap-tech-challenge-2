#!/bin/sh

# Espera 5 segundos até o banco subir
sleep 5

# Execute as migrações
npm run migrate:up

# Inicie a aplicação
npm run docker
