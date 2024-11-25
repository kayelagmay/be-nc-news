# Northcoders News API

For instructions, please head over to [L2C NC News](https://l2c.northcoders.com/courses/be/nc-news).

## Setting Up Environment Variables
This project requires two environment files: <br>
**.env.development** and **.env.test** 

These files store the names of the databases needed for development and testing. You must create these files in the root of your project directory.

In each file, add `PGDATABASE=` followed by the correct database name for that environment.
The names of these databases can be found in the **/db/setup.sql** file.

Please double check that these .env files are not tracked by Git (this has already been handled by the provided .gitignore).

## Installing Dependencies
Run the following command to install project dependencies:

`npm install`

Please don't install specific packages yet as you can do this if and when you need them.

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
