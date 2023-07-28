CREATE SCHEMA movies;
CREATE TABLE movies.basic_info (
	movie_id INT NOT NULL PRIMARY KEY,
    title VARCHAR(255),
    start_year INT,
    run_time_minutes INT,
    is_adult TINYINT(1)
);
CREATE TABLE movies.person_info (
	person_id INT NOT NULL PRIMARY KEY,
    primary_name VARCHAR(100),
    birth_year INT,
    death_year INT,
    primary_profession VARCHAR(100),
    known_for_titles VARCHAR(100)
);
CREATE TABLE movies.movie_rating (
	movie_id INT NOT NULL,
    average_rating DECIMAL(3, 1),
    num_votes INT,
    FOREIGN KEY (movie_id) REFERENCES movies.basic_info(movie_id)
);
CREATE TABLE movies.movie_director (
	movie_id INT NOT NULL,
    person_id INT NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies.basic_info(movie_id),
    FOREIGN KEY (person_id) REFERENCES movies.person_info(person_id)
);
CREATE TABLE movies.movie_actor (
	movie_id INT NOT NULL,
    person_id INT NOT NULL,
    characters_played VARCHAR(255),
    FOREIGN KEY (movie_id) REFERENCES movies.basic_info(movie_id),
    FOREIGN KEY (person_id) REFERENCES movies.person_info(person_id)
);
CREATE TABLE movies.genre (
	genre_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    genre_name VARCHAR(100)
);
CREATE TABLE movies.movie_genre (
	movie_id INT NOT NULL,
    genre_id INT NOT NULL,
	FOREIGN KEY (movie_id) REFERENCES movies.basic_info(movie_id),
    FOREIGN KEY (genre_id) REFERENCES movies.genre(genre_id)
);
CREATE TABLE movies.user (
	user_name VARCHAR(100) NOT NULL PRIMARY KEY,
    user_password VARCHAR(100) NOT NULL
);
CREATE TABLE movies.comment (
    comment_id INT NOT NULL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    movie_id INT NOT NULL,
    comment VARCHAR(1000) NOT NULL,
    num_like INT, 
    check(num_like >= 0),
    num_dislike INT, 
    check(num_dislike >= 0),
    FOREIGN KEY (user_name) REFERENCES movies.user(user_name),
    FOREIGN KEY (movie_id) REFERENCES movies.basic_info(movie_id)
);

CREATE TABLE movies.comment_like (
	comment_id INT NOT NULL REFERENCES movies.comment,
    user_name VARCHAR(100) NOT NULL REFERENCES movies.user(user_name),
	like_comment BOOL,  
    PRIMARY KEY(comment_id, user_name)
);

CREATE TABLE movies.user_rating (
	movie_id INT NOT NULL,
    user_name VARCHAR(100),
    rating DECIMAL(3, 1) NOT NULL,
    PRIMARY KEY (movie_id, user_name),
    FOREIGN KEY (movie_id) REFERENCES movies.basic_info(movie_id),
    FOREIGN KEY (user_name) REFERENCES movies.user(user_name)
);

CREATE TRIGGER movies.set_average
AFTER INSERT ON movies.user_rating
FOR EACH ROW
	UPDATE movies.movie_rating
	SET movies.movie_rating.average_rating = (movies.movie_rating.average_rating*movies.movie_rating.num_votes + NEW.rating) / (movies.movie_rating.num_votes + 1)
		WHERE movies.movie_rating.movie_id = NEW.movie_id;
        
CREATE TRIGGER movies.set_average_2
AFTER UPDATE ON movies.user_rating
FOR EACH ROW
	UPDATE movies.movie_rating
	SET movies.movie_rating.average_rating = (movies.movie_rating.average_rating + NEW.rating - OLD.rating) / (movies.movie_rating.num_votes)
		WHERE movies.movie_rating.movie_id = NEW.movie_id;
        
CREATE TRIGGER movies.set_num_votes
AFTER INSERT ON movies.user_rating
FOR EACH ROW
	UPDATE movies.movie_rating
	SET movies.movie_rating.num_votes = movies.movie_rating.num_votes + 1
    WHERE movies.movie_rating.movie_id = NEW.movie_id;

delimiter //
CREATE TRIGGER movies.set_comment_likes 
AFTER INSERT ON movies.comment_like
FOR EACH ROW
BEGIN
    IF NEW.like_comment
    THEN
	UPDATE movies.comment
    SET movies.comment.num_like = movies.comment.num_like + 1
    WHERE NEW.comment_id = comment_id;
    ELSE
    UPDATE movies.comment
    SET movies.comment.num_dislike = movies.comment.num_dislike + 1
    WHERE NEW.comment_id = comment_id;
    END IF;
END; //
delimiter ;

delimiter //
CREATE TRIGGER movies.update_comment_likes 
AFTER UPDATE ON movies.comment_like
FOR EACH ROW
BEGIN
	IF NEW.like_comment <> OLD.like_comment THEN
		IF NEW.like_comment THEN
		BEGIN
			UPDATE movies.comment
			SET movies.comment.num_like = movies.comment.num_like + 1
			WHERE NEW.comment_id = comment_id;
			UPDATE movies.comment
			SET movies.comment.num_dislike = movies.comment.num_dislike - 1
			WHERE NEW.comment_id = comment_id;
		END;
		ELSE
		BEGIN
			UPDATE movies.comment
			SET movies.comment.num_dislike = movies.comment.num_dislike + 1
			WHERE NEW.comment_id = comment_id;
			UPDATE movies.comment
			SET movies.comment.num_like = movies.comment.num_like - 1
			WHERE NEW.comment_id = comment_id;
		END;
		END IF;
    END IF;
END; //
delimiter ;

delimiter //
CREATE TRIGGER movies.remove_comment_likes 
AFTER DELETE ON movies.comment_like
FOR EACH ROW
BEGIN
	IF OLD.like_comment THEN
	UPDATE movies.comment
	SET movies.comment.num_like = movies.comment.num_like - 1
	WHERE OLD.comment_id = comment_id;
	ELSE
		UPDATE movies.comment
		SET movies.comment.num_dislike = movies.comment.num_dislike - 1
		WHERE OLD.comment_id = comment_id;
    END IF;
END; //
delimiter ;
