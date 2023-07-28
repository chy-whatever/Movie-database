# app/api/movies.py

from flask import Blueprint, jsonify, request
from app.db import get_db_connection
from flask_jwt_extended import create_access_token, jwt_required
from app.main import bcrypt

users = Blueprint('users', __name__)


@users.route('/register', methods=['POST'])
def add_user():
    data = request.get_json()
    name = data['name']
    password = data['password']
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        cur.execute('SELECT * FROM user WHERE user_name=%s', [name])
        results = cur.fetchall()
        row_count = cur.rowcount
        if row_count != 0:
            return jsonify({'message': 'User already exists'}), 500
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        cur.execute('INSERT INTO user VALUES (%s, %s)', (name, hashed_password))
        connection.commit()

        return jsonify({'message': 'success'}), 200
    except Exception as e:
        print(e)
        return jsonify({'message': e}), 500


@users.route('/login', methods=['POST'])
def user_login():
    username = request.json['username']
    password = request.json['password']

    # Check if the user exists in the database
    connect = get_db_connection()
    cur = connect.cursor()
    cur.execute('SELECT * FROM user WHERE user_name=%s', [username])
    data = cur.fetchone()
    row_count = cur.rowcount
    if row_count == 0 or not bcrypt.check_password_hash(data[1], password):
        return jsonify({'message': 'Invalid username or password'}), 401
    # Generate the access token
    access_token = create_access_token(identity=data[0])

    return jsonify({'token': access_token, 'user': username}), 200


@users.route('/comment', methods=['POST'])
def comment():
    data = request.get_json()
    name = data['name']
    movie_id = data['movie_id']
    comment = data['comment']
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        cur.execute('SELECT MAX(comment_id) FROM comment')
        data = cur.fetchone()
        if data[0] is None:
            comment_id = 0
        else:
            comment_id = data[0] + 1
        cur.execute('INSERT INTO comment VALUES (%s, %s, %s, %s, 0, 0)', (comment_id, name, movie_id, comment))
        comment_id += 1
        connection.commit()
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users.route('/like_comment', methods=['POST'])
def like_comment():
    data = request.get_json()
    name = data['name']
    comment_id = data['comment_id']
    like_comment = data['like_comment']
    print(comment_id)
    try: 
        connection = get_db_connection()
        cur = connection.cursor()
        # check if data is already in db
        cur.execute('INSERT INTO comment_like VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE like_comment = %s', [comment_id, name, like_comment, like_comment])
        connection.commit()
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
    
@users.route('/remove_like_comment', methods=['POST'])
def remove_like_comment():
    data = request.get_json()
    name = data['name']
    comment_id = data['comment_id']
    print(comment_id)
    try: 
        connection = get_db_connection()
        cur = connection.cursor()
        # check if data is already in db
        cur.execute('DELETE FROM comment_like WHERE comment_id = %s AND user_name = %s', [comment_id, name])
        connection.commit()
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users.route('/comment_display/<movie_id>/<int:num>/<name>')
def comment_display(movie_id, num, name):
    print(name)
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        json_data = []
        if name is None: 
            cur.execute('SELECT * FROM comment WHERE movie_id = %s ORDER BY comment_id DESC LIMIT %s', [movie_id, num])
            data = cur.fetchall()
            # also indicate whether the current user has liked the displaying comment
            for row in data:
                json_data.append({ 'comment_id': row[0], 'username': row[1], 'comment': row[3], 'num_like': row[4], 'num_dislike': row[5], 'like': 0, 'neither': 1})
        else: 
            cur.execute('SELECT * FROM comment c left outer join (select * from comment_like where user_name = %s) cl on c.comment_id = cl.comment_id WHERE movie_id = %s ORDER BY c.comment_id DESC LIMIT %s', [name, movie_id, num])
            data = cur.fetchall()
            for row in data:
                if row[8] is None: 
                    json_data.append({ 'comment_id': row[0], 'username': row[1], 'comment': row[3], 'num_like': row[4], 'num_dislike': row[5], 'like': 0, 'neither': 1})
                else: 
                    json_data.append({ 'comment_id': row[0], 'username': row[1], 'comment': row[3], 'num_like': row[4], 'num_dislike': row[5], 'like': row[8], 'neither': 0})
        return jsonify(json_data)
    except Exception as e:
        return f'Failed to connect to the database: {str(e)}'


@users.route('/rating', methods=['POST'])
def rating():
    data = request.get_json()
    user_name = data['user_name']
    movie_id = data['movie_id']
    rating = data['rating']
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        cur.execute('INSERT INTO user_rating (user_name, movie_id, rating) VALUES ( %s, %s, %s) ON DUPLICATE KEY UPDATE'
                    ' rating = %s;',
                    (user_name, movie_id, rating, rating))
        connection.commit()
        return jsonify({'message': 'Success'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@users.route('/user-rating/<user>/<int:movie_id>', methods=['GET'])
def get_user_rating(user, movie_id):
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        cur.execute('SELECT rating FROM user_rating WHERE movie_id = %s AND user_name = %s', [movie_id, user])
        data = cur.fetchone()
        return jsonify({'userRating': data[0]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@users.route('/like-list/<user>', methods=['GET'])
def get_user_likes(user):
    try:
        connection = get_db_connection()
        cur = connection.cursor()
        cur.execute('SELECT comment_like.user_name, like_comment, comment FROM comment_like JOIN comment ON comment.comment_id = comment_like.comment_id WHERE comment.user_name = %s', [user])
        data = cur.fetchall()
        like_data = []
        for row in data:
            if (row[1]):
                like_data.append({'user': row[0], 'comment': row[2]})
        return jsonify(like_data), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500