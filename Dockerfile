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

RUN echo "=== Contents of /app ===" && ls -la /app/
RUN echo "=== Contents of dist ===" && ls -la dist/
RUN echo "=== Finding main files ===" && find dist -name "main.js"

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
