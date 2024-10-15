# Installation

To set up the Tennis Match Tracker API, follow these steps:

1. **Clone the repository:**

```sh
git clone https://github.com/yourusername/tennis-match-tracker-API.git
cd tennis-match-tracker-API
```

2. **Setup the environment:**

```sh
cp .env.dist .env
```

The application uses a mail service to send emails. To set up the mail service, you need to provide the following environment variables in the `.env` file:

EMAIL_USER=''
EMAIL_PASS=''
EMAIL_HOST=''
EMAIL_PORT=''

The emails are used for veryfing the user's email address and for sending the password reset link. Because the application is in development, the email verification is not necessary to log in. The password reset link is necessary to change the password, however, if the NODE_ENV is set to 'development', the password reset link will be displayed in the console.

3. **Run the docker-compose file:**

```sh
docker-compose up -d
```

The docker-compose file will create two containers: one for the API and one for the database.

Your Tennis Match Tracker API should now be up and running!

4. **Loading the test database:**

```sh
cd tennis-match-tracker-API
docker cp ./dump.sql tennis-match-tracker-api-db-1:/dump.sql
docker exec -it tennis-match-tracker-api-db-1 bash
pg_restore --clean --if-exists -U yourusername -d tennis_match_tracker /dump.sql
```

# Usage

1. **Interacting with the API:**

To interact with the Tennis Match Tracker API, you can use the frontend application. To set up the frontend, follow the steps in the following repository:

[Frontend Repository](https://github.com/mateuszpolis/tennis-match-tracker)

2. **Using the application with test database:**

To make use the test database, you can log in with the following
credentials:

Admin:

- email: admin@mail.com
- password: Secure.Password1

Moderator:

- email: moderator@mail.com
- password: Secure.Password1

User:

There are a lot of users. You can get them from the Rankings.

- email format: name_surname@mail.com
- password: Secure.Password1

# Tests

To ensure the functionality of your Tennis Match Tracker API, follow these steps to run the tests:

1. **Navigate to the project directory:**

```sh
cd tennis-match-tracker-API
```

2. **Install testing dependencies:**
   Ensure you have the necessary testing libraries installed. If not, you can install them using:

```sh
npm install --save-dev jest supertest
```

3. **Run the tests:**

```sh
npx jest
```

4. **Check test results:**
   After running the tests, you should see the results in your terminal.

Your tests should now be executed, and you can verify the functionality of your Tennis Match Tracker API!
