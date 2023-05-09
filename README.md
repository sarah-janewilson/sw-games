## Environment setup

If you wish to clone this repo, you will not have access to the necessary environment variables. To connect to the two databases locally, please add the following files to your root:

.env.test
.env.development

In .env.test, add PGDATABASE=nc_games_test
In .env.development, add PGDATABASE=nc_games

Double check that these .env files are .gitignored with .env.*