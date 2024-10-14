# Installation

To set up the Tennis Match Tracker API, follow these steps:

1. **Clone the repository:**
  ```sh
  git clone https://github.com/yourusername/tennis-match-tracker-API.git
  cd tennis-match-tracker-API
  ```

2. **Install dependencies:**
  ```sh
  npm install
  ```

3. **Set up environment variables:**
  Create a `.env` file in the root directory and add the necessary environment variables. Refer to `.env.dist` for guidance.

4. **Run the application:**
  ```sh
  npm start
  ```

5. **Access the API:**
  Open your browser and navigate to `http://localhost:3000`.

Your Tennis Match Tracker API should now be up and running!

tennis-match-tracker-API % docker exec -t tennis-match-tracker-api-db-1 pg_dump -U yourusername -d tennis_match_tracker -F c > /Users/mateuszpolis/Documents/University/SEMESTER5/WebApplicationProgramming/tennis-match-tracker-API/dump.sql

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
