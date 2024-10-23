# Step 1: Use an official Node.js runtime as the base image to build the Angular app
FROM node:20-slim AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json to the container and install dependencies
COPY package*.json ./

# Remove package-lock.json and node_modules to avoid conflicts
RUN rm -rf package-lock.json node_modules

# Install Angular CLI and project dependencies
RUN npm install -g @angular/cli && npm install

# Step 4: Copy the entire Angular project to the working directory
COPY . .

# Step 5: Build the Angular app for production
RUN ng build --configuration=production

# Step 6: Use an Nginx image to serve the built app
FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Step 7: Copy the production build from the previous build stage to Nginx's web directory
COPY --from=build /app/dist/my-daily-track/browser /usr/share/nginx/html


# Step 8: Expose port 80 to access the app
EXPOSE 80