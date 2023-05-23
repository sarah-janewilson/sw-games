## Northcoders House of Games API
This project is an API for accessing application data programmatically, similar to a real-world backend service. It provides information to the front-end architecture and utilises a PostgreSQL database, interacting with it using node-postgres.

## Kanban Board
The project's progress was tracked using a Kanban board. You can find the Trello board here: https://trello.com/b/dsjqMmH4/be-nc-games-sarah-wilson. The board contains tickets that represent features or tasks, and each ticket was completed with both the happy path and error response handling.

## Hosted version
This project is deployed using ElephantSQL, which provides an online location for the database, and Render, which hosts the API.

The API documentation for the be-nc-games project can be found here: https://sarah-nc-games.onrender.com/api. It provides detailed information about the available endpoints and their functionalities.

Base URL: https://sarah-nc-games.onrender.com/api
Endpoints:
/categories
/reviews
/reviews/:review_id
/reviews/:review_id/comments
/users

## Clone the repository
1. Open a terminal or command prompt.

2. Change the current working directory to the location where you want to clone the repository.

3. Run the following command to clone the repository:
git clone https://github.com/sarah-janewilson/sw-games

## Prerequisites
Node.js (minimum version 18.15.0)
PostgreSQL (minimum version 15.2)

## Environment setup
If you wish to clone this repo, you will not have access to the necessary environment variables. To connect to the two databases locally, please add the following files to your root:

.env.test
.env.development

In .env.test, add PGDATABASE=nc_games_test
In .env.development, add PGDATABASE=nc_games

Double check that these .env files are .gitignored with .env.*

## Usage
1. Install the dependencies:
npm install
This command will install all the required dependencies listed in the package.json file.

2. Set up the databases by running the following command:
npm run setup-dbs

3. Seed the database with initial data:
npm run seed

4. Start the development server:
npm run dev

The server should now be running on http://localhost:9090.

## Testing
To run the test suite, use the following command:
npm test