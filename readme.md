mamazYoga Back-End

This is the back-end server for the mamazYoga application.
Installation

    Clone this repository to your machine:

    bash

git clone https://github.com/your-username/mamaz-yoga-back.git

Navigate to the project directory:

bash

cd mamaz-yoga-back

Install the necessary dependencies:

bash

npm install

Install the dotenv module in the /api folder:

bash

cd api
npm install dotenv

Create a .env file in the /api directory and add your MySQL database connection information:

plaintext

USERNAME=your_username
PASSWORD=your_password

If you encounter an "Access denied for user" error, you may need to execute the following MySQL command to update the user's authentication method. Run this command in your MySQL command line interface within the Docker container:

sql

    ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'your_password';

    To access the MySQL command line interface within Docker, follow these steps:
        Use docker ps to find the container ID or name of your MySQL Docker container.
        Then, use docker exec -it <container_id_or_name> mysql -u root -p to access the MySQL command line interface. You will be prompted to enter your MySQL root password.

Note:

If you encounter an "Access denied for user" error, make sure to check the correctness of your username and password in the .env file. If the error persists, consider resetting the MySQL password or checking your MySQL user privileges.
Usage

    Start the server:

    bash

    npm start

    The server will be accessible at: http://localhost:3000.


Remove Untracked Files (Optional)

If you have untracked files or directories in your project that you want to remove, you can use the following Git commands:

bash

git rm -r --cached node_modules
git rm -r --cached api/node_modules
git rm -r --cached .env
git rm -r --cached api/idapi.env
git rm --cached package-lock.json
git rm --cached api/package-lock.json
git rm --cached mamazyp80.json