FROM node:22.17

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose port
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
