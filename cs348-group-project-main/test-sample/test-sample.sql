CREATE SCHEMA movies;
CREATE TABLE movies.basic_info (
	movie_id INT NOT NULL PRIMARY KEY,
    title VARCHAR(255),
    start_year INT,
    run_time_minutes INT,
    is_adult TINYINT(1)
);
CREATE TABLE movies.movie_rating (
	movie_id INT NOT NULL,
    average_rating DECIMAL(3, 1),
    num_votes INT,
    FOREIGN KEY (movie_id) REFERENCES movies.basic_info(movie_id)
);
CREATE TABLE movies.person_info (
	person_id INT NOT NULL PRIMARY KEY,
    primary_name VARCHAR(100),
    birth_year INT,
    death_year INT,
    primary_profession VARCHAR(100),
    known_for_titles VARCHAR(100)
);
CREATE TABLE movies.user (
	user_name VARCHAR(100) NOT NULL PRIMARY KEY,
    user_password VARCHAR(100) NOT NULL
);

SET global local_infile = 1;
#remember to change the path to your local file path, thanks
LOAD DATA LOCAL INFILE 'C:/Users/chy/Desktop/cs348/new-data/basic_info.csv' 
INTO TABLE movies.basic_info
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
#remember to change the path to your local file path, thanks
LOAD DATA LOCAL INFILE 'C:/Users/chy/Desktop/cs348/new-data/movie_rating.csv' 
INTO TABLE movies.movie_rating
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
#remember to change the path to your local file path, thanks
LOAD DATA LOCAL INFILE 'C:/Users/chy/Desktop/cs348/new-data/user.csv' 
INTO TABLE movies.movie_rating
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
INSERT INTO movies.person_info VALUES(123, "Bob" , 2000, 2020, "a", "actor");
SELECT movie_id, title, start_year, run_time_minutes, is_adult 
FROM movies.basic_info WHERE title="Nosferatu";
SELECT person_id,primary_name, birth_year, death_year, primary_profession, known_for_titles 
FROM movies.person_info WHERE primary_name="Bob";
SELECT * FROM movies.basic_info ORDER BY title;
SELECT * FROM movies.basic_info ORDER BY start_year;
SELECT movie_id, title, start_year, run_time_minutes, is_adult 
FROM movies.basic_info NATURAL JOIN movies.movie_rating 
ORDER BY average_rating;
NSERT INTO movies.user VALUES ("NewUser1", "RanDOMpass");
SELECT * FROM movies.user;
