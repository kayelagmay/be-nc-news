# Northcoders News API

Link to Project: [NC News API](https://nc-news-zelj.onrender.com/api)

## Project Summary

Northcoder News is an API built using Node.js, Express, and PostgreSQL, with testing implemented using Jest and Supertest. <br>
<br>
It is designed to provide a backend for managing data related to articles, comments, topics, and users, allowing users to interact with these resources through basic CRUD operations. It allows users to retrieve, add, update, and delete. The API is is connected and focuses on integration with a PostgreSQL database, environment variable management with dotenv, and Git hooks enforced by Husky to ensure code quality.

The *endpoints.json* file serves as documentation for developers to have an easily accessible summary of all API routes. <br>
It provides a structured overview of all available API endpoints, their methods (GET, POST, etc.), and a brief description of their functionality;
allowing for quick referencing without needing to go through the source code. <br>
This is especially useful for those who are interacting with the API or integrating it with other applications. <br>
It is automatically available at the **/api** endpoint.

## Requirements

Before getting started, ensure that you have the following installed:

Node.js >= 18.x

PostgreSQL >= 12.x

## How To 
### 1. Clone the Repository

`git clone https://github.com/kayelagmay/be-nc-news`

Don't forget to change into the correct directory!

### 2. Install Dependencies
Run the following command to install project dependencies:

`npm install`

This will install pg, dotenv, Jest, and other dependencies listed in the *package.json* file.

*Note*: It is recommended to install additional packages as needed to avoid unnecessary bloat. <br> 
To add a new package, simply run 
` npm install <package-name> `

The following packages will need to be installed:
- Express
- Supertest
- jest-sorted

### 3. Set Up Environment Variables
This project uses the **dotenv** package and requires two environment files: <br>
*.env.development* and *.env.test*

These files store the names of the databases needed for development and testing. <br>
You must create these files in the root of your project directory.

In each file, add `PGDATABASE=` followed by the correct database name for that environment. <br>
The names of these databases can be found in the */db/setup.sql* file.

Please double check that these .env files are not tracked by Git (this has already been handled by the provided *.gitignore*).

### 4. Set Up the Database
To set up the PostgreSQL database for development and testing, run the setup scripts:

`npm run setup-dbs`

This will run the *setup.sql* file create the necessary database schema. <br> 

To seed your database with initial data, use:

`npm run seed`

This will execute the run-seed.js script to populate your database with sample data.

### 4. Run the Tests
To run the tests, use:

`npm test`

----------

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)