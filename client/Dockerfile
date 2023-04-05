FROM node:18-alpine

RUN mkdir -p /app

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

RUN cp env.template .env

RUN pnpm build

COPY . .

EXPOSE 5000
