# run import.sql and create.sql first
SELECT movie_id, title, start_year, run_time_minutes, is_adult 
FROM movies.basic_info WHERE title="Nosferatu";
SELECT person_id,primary_name, birth_year, death_year, primary_profession, known_for_titles 
FROM movies.person_info WHERE primary_name="Bob";
SELECT * FROM movies.basic_info ORDER BY title LIMIT 20;
SELECT * FROM movies.basic_info ORDER BY start_year LIMIT 20;
SELECT movie_id, title, start_year, run_time_minutes, is_adult 
FROM movies.basic_info NATURAL JOIN movies.movie_rating 
ORDER BY average_rating LIMIT 20;
SELECT * FROM movies.user;
insert into movies.comment values(1, NewUser1, 12349, "Good");
SELECT * FROM comment WHERE movie_id = NewUser1 ORDER BY comment_id DESC LIMIT 5