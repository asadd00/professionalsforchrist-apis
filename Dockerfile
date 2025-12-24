FROM node:22.17

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client from schema
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

RUN ls -la dist/

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
