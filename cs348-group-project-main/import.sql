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
LOAD DATA LOCAL INFILE 'C:/Users/chy/Desktop/cs348/new-data/movie_genre.csv' 
INTO TABLE movies.movie_genre
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE 'C:/Users/chy/Desktop/cs348/new-data/person_info.csv' 
INTO TABLE movies.person_info
character set latin7
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE 'C:/Users/chy/Desktop/cs348/new-data/movie_actor.csv' 
INTO TABLE movies.movie_actor
character set latin7
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;
LOAD DATA LOCAL INFILE 'C:/Users/chy/Desktop/cs348/new-data/movie_director.csv' 
INTO TABLE movies.movie_director
FIELDS TERMINATED BY ';' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

