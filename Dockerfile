FROM node:14
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]