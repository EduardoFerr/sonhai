# Imagem base com Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia todos os arquivos do projeto para dentro do container
COPY . .

# Instala dependências do projeto
RUN npm install

# Instala o servidor estático globalmente
RUN npm install -g serve

# Build e export do Next.js para HTML estático
RUN npm run build

# Expõe a porta do servidor
EXPOSE 3000

# Comando para iniciar o servidor estático servindo o conteúdo da pasta 'out'
CMD ["serve", "-s", "out", "-l", "3000"]
