# run create.sql before this
insert into movies.comment values(1, NewUser1, 12349, "Good");
SELECT * FROM comment WHERE movie_id = NewUser1ORDER BY comment_id DESC LIMIT 5