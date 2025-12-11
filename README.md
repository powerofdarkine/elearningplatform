## Getting Started.

First, install dependencies:

```bash
npm install
```

## Set up Database (MySQL)

1. Setup MySQL: First, setup your local host using MySQL Configurator. Choose the root user.
2. Import Data: Open MySQL Workbench and connect to your local host.
3. Run Scripts: Import the .sql files found in the Database folder. Run them in this exact sequence:
  * task 1.1.sql
  * task 1.2.sql
  * task 2.1.sql
  * task 2.3.sql
  * task 2.4.sql
  * task 2.2.sql

## Create Sign-in, Sign-up with Clerk:

1. Create an account with Clerk: https://clerk.com/
2. Make your own sign-in form.
3. Copy your API keys ans paste it to the .env file

## Set Up Environment

1. Create a new file named .env in the root directory.
2. Then pass this the code below to file .env:

```
#Clerk API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

#Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Replace PASSWORD with your actual root password in local host.
DATABASE_URL="mysql://root:PASSWORD@localhost:3306/elearning_db"
```

## Connect your database to the project

Run the following commands to sync your schema and generate the client:
```bash
npx prisma db pull
npx prisma generate
```

## Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


