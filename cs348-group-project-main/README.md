# CS348 Group Project: IMDB Movie Ratings

A movie website for viewing basic movie related information and posting comments.

## Prerequisites

Before running the application, ensure that you have the following software installed on your system:

- MySQL server installed and running.
- Access to a MySQL client or command-line interface (CLI).
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Python (version 3.7 or higher)
- pip (Python package installer)

## Installation

1. Clone the repository to your local machine:
```git clone <repository-url>```

2. Connect to your MySQL server using the CLI or MySQL client:
```mysql -u <username> -p```

3. Paste the script into the MySQL CLI or client and execute it:
```mysql> source /path/to/create.sql;```
Replace `/path/to/create.sql` with the actual path to the `create.sql` file.
This would create the necessary tables for this project. 

5. Load data from csv files using the script
```mysql> source /path/to/import.sql;```
Replace `/path/to/load.sql` with the actual path to the `load.sql` file.

6. Navigate to the backend project directory:
```cd movies_api```

7. Install the project dependencies using pip:
```pip install -r requirements.txt```

8. Create a `.env` file and configure environment variables using the following format:
```
MYSQL_HOST=localhost
MYSQL_USER=<username>
MYSQL_PASSWORD=<password>
MYSQL_DB=movies
JWT_SECRET_KEY=<secret_key>
```

5. Run the backend server on localhost: 
```flask run```

6. Navigate to the frontend project directory:
```cd movies_app```

7. Install the project dependencies using npm:
```npm install```

8. Start the frontend development server:
```npm start```

## Generate production dataset
1. Change the path in import.sql to the file locations on your local machine

2. On MySQLWorkbench, go to database > Connect to Database > Advance, add 'OPT_LOCAL_INFILE=1' to Others; then click OK

3. Execute import.sql on the new connection

