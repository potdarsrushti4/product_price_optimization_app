# Use official Node.js image
FROM node:18-bullseye

# Install Python
RUN apt-get update && apt-get install -y python3 python3-pip

# Set working directory inside the container
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy all other files (your server.js, python folder, etc.)
COPY . .

# Expose the port Render uses
ENV PORT=5000
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
