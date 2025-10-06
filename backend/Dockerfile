# Use official Node.js image
FROM node:18-bullseye

# Install Python and pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Set working directory
WORKDIR /app

# Copy Node.js package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy the Python folder including requirements.txt
COPY python/ ./python/

# Install Python dependencies
RUN pip3 install --no-cache-dir -r ./python/requirements.txt

# Copy all remaining backend files (server.js, etc.)
COPY . .

# Expose the port Render uses
ENV PORT=5000
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
