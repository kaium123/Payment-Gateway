# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the application (if applicable, e.g., if using TypeScript)
# RUN npm run build

# Expose the port that your app runs on
EXPOSE 3000

# Define environment variables
ENV NODE_ENV=production

# Command to run the application
CMD [ "npm", "start" ]
