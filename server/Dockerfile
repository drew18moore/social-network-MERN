FROM node:18

# Install OpenSSL 1.1 (required by MongoDB native bindings)
RUN apt-get update && \
    apt-get install -y libssl1.1 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]
