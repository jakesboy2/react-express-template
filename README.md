# Setting up the application for development

1. Clone the repo
2. From root directory:
  a. `npm install`
  b. `npm install -g knex` (This allows you to run knex commands)
3. From client directory
  a. `npm install`
4. Change the name of the sqlite3 file to prevent clashes with multiple instances of this template
5. Create an account on <https://mailtrap.io> and init a sandbox inbox
6. Create a .env file in the project root with the following contents:

```
NODE_ENV=development
JWT_TOKEN=generate_b64_token_here
JWT_REFRESH_TOKEN=generate_token_here
EMAIL_USER=mailtrap_username_here
EMAIL_PASSWORD=mailtrap_password_here
```

6. Create a .env file in your client directory with the following contents:

```
REACT_APP_BASE_URL=http://localhost:8000/api/
```

## Starting the Client Application

1. From the client directory:
  a. `npm run dev`

## Starting the Server Application

1. From the root directory:
  a. `npm run migrate:latest`
  b. `npm run dev`

## Making Schema Changes

1. You must first create a migration file for your schema change. From the root directory:
  a. `npm run migrate:make -- migration_name_here`
2. The up function defines the changes that will apply when the migration is run.
3. The down function defines the changes that will apply when the migration rolls back
4. For example, if you are adding a table you would add it in the "up" function, and you would drop it in the "down" function. Note all data will be lost if you drop a table or a column in the event of a rollback.The [documentation is here](https://knexjs.org/guide/)

## Using Material UI

This application takes advantage of Material UI. There is a custom theme defined in `nord-theme.tsx`, changes can be made there if it becomes required to adjust the color scheme. You can import icons from `@mui/icons-material` and components from `@mui/material`. The [documentation is here](https://mui.com/material-ui/react-autocomplete/).

## Additional Production .env data

```
GOOGLE_EMAIL=google_account_email
GOOGLE_PASSWORD=app_password_from_google
DB_USER=db_user
DB_PASS=db_password
DB_HOST=db_host
DB_PORT=db_port
DB_NAME=db_name
```
