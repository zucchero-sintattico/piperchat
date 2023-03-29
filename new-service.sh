#!/bin/bash

# Create a new service
# Usage: new-service.sh <service-name>

# Check if service name is provided
if [ -z "$1" ]; then
    echo "Usage: new-service.sh <service-name>"
    exit 1
fi

# Create service directory
mkdir -p $1

# CD into service directory
cd $1

# Run npm init
npm init -y

# Install dependencies
npm install --save express
npm install --save mongoose
npm install --save amqplib
npm install --save dotenv

npm install --save-dev nodemon
npm install --save-dev typescript

npm install --save-dev jest
npm install --save-dev ts-jest
npm install --save-dev supertest

npm install --save-dev @types/node
npm install --save-dev @types/express
npm install --save-dev @types/mongoose
npm install --save-dev @types/amqplib
npm install --save-dev @types/supertest
npm install --save-dev @types/jest


# Create tsconfig.json
echo '{
    "compilerOptions": {
        "target": "es6",
        "module": "commonjs",
        "outDir": "dist",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    },
    "include": [
        "src/**/*"
    ]
}' > tsconfig.json

# Create src directory
mkdir src

# Create index.ts
touch src/index.ts

# Create routes directory
mkdir src/routes

# Create controllers directory
mkdir src/controllers

# Create models directory
mkdir src/models

# Create events directory
mkdir src/events

# Setup tasks in package.json (start, build, dev, test)
sed -i 's/"test": "echo \"Error: no test specified\" && exit 1"/"start": "node dist\/index.js", "build": "tsc", "dev": "nodemon --watch src --exec ts-node src\/index.ts", "test": "jest"/g' package.json


        
