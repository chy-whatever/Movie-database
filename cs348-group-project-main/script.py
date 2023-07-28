import mysql.connector
import csv

# MySQL database connection details
host = 'localhost'
user = 'root'
password = 'ZMx-02524'
database = 'movies'

# Chunk size for processing the file
chunk_size = 100  # Adjust as needed


def import_basics():
    # Establish a connection to the MySQL database
    cnx = mysql.connector.connect(host=host, user=user, password=password, database=database)

    # Create a cursor object
    cursor = cnx.cursor()
    # truncate_query = "TRUNCATE TABLE genres"
    # cursor.execute(truncate_query)
    # Open the CSV file
    existing_genres = []
    movie_genre = {}
    with open('../basic_info.csv', 'r') as csvfile:
        next(csvfile)
        csv_data = csv.reader(csvfile)

        # Iterate over the CSV data and insert rows into the table
        for row in csv_data:
            movie_genre[row[0]] = []
            for genre in row[4].split(','):
                movie_genre[row[0]].append(genre)
                if genre not in existing_genres:
                    print(genre)
                    existing_genres.append(genre)

        for movie in movie_genre.keys():
            for genre in movie_genre[movie]:
                print(genre, movie)
                cursor.execute("SELECT genre_id FROM genre WHERE genre_name=%s", [genre])
                genre_id = cursor.fetchone()
                cursor.execute("INSERT INTO movie_genre (movie_id, genre_id) VALUES (%s, %s)", [movie, genre_id[0]])

    # Commit the changes to the database
    cnx.commit()

    # Close the cursor and the database connection
    cursor.close()
    cnx.close()


def import_casts():
    # TSV file path
    tsv_file = '../casts.tsv'

    # Establish a connection to MySQL
    connection = mysql.connector.connect(host=host, user=user, password=password, database=database)

    # Create a cursor object
    cursor = connection.cursor()

    # Truncate the table before importing data (optional)
    # truncate_query = "TRUNCATE TABLE casts"
    # cursor.execute(truncate_query)

    select_query = "SELECT tconst FROM basics"
    cursor.execute(select_query)
    rows = cursor.fetchall()
    movies = [item for t in rows for item in t]

    # Open the TSV file for reading
    with open(tsv_file, 'r', encoding='utf-8') as file:
        # Skip the header line
        next(file)

        # Read and process the file in chunks
        chunk = []

        for line in file:
            # Split the line into columns
            columns = line.strip().split('\t')

            # Append the columns to the chunk
            if 1979388 <= int(columns[0][2:]) <= 2024432 and (int(columns[0][2:]) in movies) and (
                    columns[3] == 'actor' or columns[3] == 'actress') and columns[5] != '\\N':
                # Append the columns to the chunk
                print([int(columns[0][2:]), int(columns[2][2:]), columns[5]])
                load_query = 'INSERT INTO casts (tconst, nconst, characters) VALUES (%s, %s, %s)'
                cursor.execute(load_query, [int(columns[0][2:]), int(columns[2][2:]), columns[5]])
                connection.commit()

            # Check if the chunk has reached the desired size

    # Close the cursor and connection
    cursor.close()
    connection.close()


def import_names():
    # TSV file path
    tsv_file = '../names.tsv'

    # Establish a connection to MySQL
    connection = mysql.connector.connect(host=host, user=user, password=password, database=database)

    # Create a cursor object
    cursor = connection.cursor()

    select_query = "SELECT DISTINCT nconst FROM directors"
    cursor.execute(select_query)
    rows = cursor.fetchall()
    directors = [item for t in rows for item in t]

    select_query = "SELECT DISTINCT nconst FROM casts"
    cursor.execute(select_query)
    rows = cursor.fetchall()
    actors = [item for t in rows for item in t]

    # Truncate the table before importing data (optional)
    truncate_query = "TRUNCATE TABLE names"
    cursor.execute(truncate_query)

    # Open the TSV file for reading
    with open(tsv_file, 'r', encoding='utf-8') as file:
        # Skip the header line
        next(file)

        # Read and process the file in chunks
        chunk = []

        for line in file:
            # Split the line into columns
            columns = line.strip().split('\t')

            # Append the columns to the chunk
            if columns[2] != '\\N' and (int(columns[0][2:]) in directors or int(columns[0][2:]) in actors):
                # Append the columns to the chunk
                if columns[3] == '\\N':
                    print([int(columns[0][2:]), columns[1], columns[2], None, columns[4], columns[5]])
                    load_query = 'INSERT INTO names (nconst, primaryName, birthYear, deathYear, primaryProfession, knownForTitles) VALUES (%s, %s, %s, %s, %s, %s)'
                    cursor.execute(load_query,
                                   [int(columns[0][2:]), columns[1], columns[2], None, columns[4], columns[5]])
                    connection.commit()
                else:
                    print([int(columns[0][2:]), columns[1], columns[2], columns[3], columns[4], columns[5]])
                    load_query = 'INSERT INTO names (nconst, primaryName, birthYear, deathYear, primaryProfession, knownForTitles) VALUES (%s, %s, %s, %s, %s, %s)'
                    cursor.execute(load_query,
                                   [int(columns[0][2:]), columns[1], columns[2], columns[3], columns[4], columns[5]])
                    connection.commit()

    # Close the cursor and connection
    cursor.close()
    connection.close()


def import_ratings():
    # TSV file path
    tsv_file = '../ratings.tsv'

    # Establish a connection to MySQL
    connection = mysql.connector.connect(host=host, user=user, password=password, database=database)

    # Create a cursor object
    cursor = connection.cursor()

    # Truncate the table before importing data (optional)
    truncate_query = "TRUNCATE TABLE ratings"
    cursor.execute(truncate_query)

    # Open the TSV file for reading
    with open(tsv_file, 'r', encoding='utf-8') as file:
        # Skip the header line
        next(file)

        # Read and process the file in chunks
        chunk = []

        for line in file:
            # Split the line into columns
            columns = line.strip().split('\t')

            # Append the columns to the chunk
            if (int(columns[2]) > 100000):
                chunk.append([int(columns[0][2:]), float(columns[1]), int(columns[2])])

            # Check if the chunk has reached the desired size
            if len(chunk) >= chunk_size:
                print(chunk[0])
                # Load the chunk into the table
                load_query = '''
                INSERT INTO ratings (tconst, averageRating, numVotes) 
                VALUES (%s, %s, %s)
                '''
                cursor.executemany(load_query, chunk)
                connection.commit()

                # Clear the chunk
                chunk = []

    # Close the cursor and connection
    cursor.close()
    connection.close()


def import_directors():
    # TSV file path
    tsv_file = '../directors.tsv'

    # Establish a connection to MySQL
    connection = mysql.connector.connect(host=host, user=user, password=password, database=database)

    # Create a cursor object
    cursor = connection.cursor()

    # Truncate the table before importing data (optional)
    truncate_query = "TRUNCATE TABLE directors"
    cursor.execute(truncate_query)

    # Open the TSV file for reading
    with open(tsv_file, 'r', encoding='utf-8') as file:
        # Skip the header line
        next(file)

        # Read and process the file in chunks
        chunk = []

        for line in file:
            # Split the line into columns
            columns = line.strip().split('\t')

            # Append the columns to the chunk
            if columns[1] != '\\N':
                # Append the columns to the chunk
                id_list = columns[1].split(',')
                for director_id in id_list:
                    chunk.append([int(director_id[2:]), int(columns[0][2:])])

            # Check if the chunk has reached the desired size
            if len(chunk) >= chunk_size:
                print(chunk[0])
                # Load the chunk into the table
                load_query = '''
                INSERT INTO directors (tconst, nconst)
                SELECT tconst, %s
                FROM basics
                WHERE tconst = %s
                '''
                cursor.executemany(load_query, chunk)
                connection.commit()

                # Clear the chunk
                chunk = []

    # Close the cursor and connection
    cursor.close()
    connection.close()


import_basics()
