Demo Credit Wallet Service


This is a wallet service MVP built for the Lendsqr assessment. The service allows users to:
 Create an account  
 Fund their wallet  
 Transfer funds to another user  
 Withdraw funds  
 Prevent blacklisted users from onboarding or making transactions  

Tech Stack
Node.js (LTS)
TypeScript
Knex.js ORM
MySQL


Database Schema
![ER Diagram](demo-credit-er-diagram_1(1).png)  


Setup Instructions
Clone the Repository
```sh
git clone https://github.com/sope-mosuro/demo-credit.git
cd demo-credit


Install dependencies:
npm install

Create a .env file in the root directory and configure the required environment variables.
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
DB_PORT

ADJUTOR_API_KEY
JWT_SECRET
PORT



Run database migrations:
npx knex migrate:latest


Start the development server:
npm run build
npm start


