import datetime
from flask import Flask, render_template, redirect, request, jsonify
from flask_jwt_extended import *
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('localhost', 27017) 
db = client.jungle  
collection_users = db.users
collection_workout = db.workout

# 토큰 생성에 사용될 Secret Key를 flask 환경 변수에 등록
app.config.update(
    DEBUG = True,
    JWT_SECRET_KEY = "todaysWorkout"
)

# SECRET_KEY = 'TODAYS_WORKOUT'

# JWT 확장 모듈을 flask 어플리케이션에 등록
jwt = JWTManager(app)

@app.route('/')
def home():
    return render_template('main.html')

## 회원가입
@app.route('/user/join', methods=['GET', 'POST'])
def join():
    if request.method == 'POST':
        id_receive = request.form['user_id']
        pw_receive = request.form['user_pw']
        name_receive = request.form['user_name']
        class_receive = request.form['user_class']

        document = {
            'user_id': id_receive, 
            'user_pw': pw_receive, 
            'user_name': name_receive, 
            'user_class': class_receive,
        }

        try: 
            collection_users.insert_one(document)
            token = create_access_token(identity=id_receive, expires_delta=datetime.timedelta(hours=1))
            return jsonify({'result': 'success', 'token': token})
        except Exception as e:
            print(f"Error user join: {e}")
            return jsonify({'result': 'fail', 'msg': e})
    else:
        return render_template('join.html')
        

## 로그인
@app.route('/user/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # 클라이언트로부터 데이터 받기
        id_receive = request.form['user_id']
        pw_receive = request.form['user_pw']

        # id, pw을 가지고 해당 유저를 찾습니다.
        result = db.user.find({'user_id': id_receive, 'user_pw': pw_receive})

        # 찾으면 JWT 토큰을 만들어 발급
        if result is not None:
            token = create_access_token(identity=id_receive, expires_delta=datetime.timedelta(hours=1))

            return jsonify({'result': 'success', 'token': token})
        # 찾지 못하면
        else:
            return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})
    else: 
        return render_template('login.html')


## 모임 개설
@app.route('/workout/register', methods=['POST'])
def registerWorkout():
    title_receive = request.form['title']
    place_receive = request.form['place']
    time_receive = request.form['time']
    category_receive = request.form['category']
    maximum_receive = request.form['maximum']

    document = {
        'title': title_receive, 
        'place': place_receive, 
        'time': time_receive, 
        'category': category_receive, 
        'maximum': maximum_receive,
        'current_people': 1,
        # 'user_id': 
    }

    try:
        collection_workout.insert_one(document)
        return jsonify({'result': 'success'})
    except Exception as e:
        print(f"Error register Workout: {e}")
        return jsonify({'result': 'fail', 'msg': e})


if __name__ == '__main__':  
   app.run('0.0.0.0',port=8000,debug=True)
