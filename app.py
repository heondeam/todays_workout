import datetime
from flask import Flask, render_template, request, jsonify
from flask_jwt_extended import *
from pymongo import MongoClient

from util import Util

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

# JWT 확장 모듈을 flask 어플리케이션에 등록
jwt = JWTManager(app)

## 홈 route
@app.route('/')
def home():
    return render_template('main.html')

# 모임 리스트 조회 
@app.route('/workout', methods=['GET'])
def getWorkouts():
    token = request.headers.get('Authorization') # 토큰 정보 가져오기 

    # 토큰 검사
    if token:
        workouts = list(collection_workout.find({}, {'_id': 0}))
        totalElements = len(workouts)
        return jsonify({'result': 'success', 'totalElements': totalElements, 'workouts': workouts})
    else:
        return 'Token not found in headers', 401  
        

## 회원가입
@app.route('/join', methods=['GET', 'POST'])
def join():
    if request.method == 'POST':
        id_receive = request.form['user_id']
        pw_receive = request.form['user_pw']
        name_receive = request.form['user_name']
        class_receive = request.form['user_class']

        # ID 중복체크
        if collection_users.find_one({'user_id': id_receive}):
            return jsonify({'result': 'fail', 'msg': '아이디가 이미 사용중입니다. 새로운 아이디를 입력해주세요.'})
 
        userIdx = Util.get_next_sequence('users', 'user_idx')
        new_user = {
            'user_idx': userIdx,
            'user_id': id_receive, 
            'user_pw': pw_receive, 
            'user_name': name_receive, 
            'user_class': class_receive,
        }
        try: 
            collection_users.insert_one(new_user)
            token = create_access_token(identity=id_receive, expires_delta=datetime.timedelta(hours=1))
            
            return jsonify({'result': 'success', 'token': token, 'user_idx': userIdx})
        except Exception as e:
            print(f"Error user join: {e}")
            return jsonify({'result': 'fail', 'msg': e})
    else:
        return render_template('join.html')
        

## 로그인
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # 클라이언트로부터 데이터 받기
        id_receive = request.form['user_id']
        pw_receive = request.form['user_pw']

        # id, pw을 가지고 해당 유저를 찾습니다.
        result = collection_users.find_one({'user_id': id_receive, 'user_pw': pw_receive})

        # 찾으면 토큰을 만들어 발급
        if result is not None:
            token = create_access_token(identity=id_receive, expires_delta=datetime.timedelta(hours=1))
            userIdx = result['user_idx'] # user_idx 가져오기

            return jsonify({'result': 'success', 'token': token, 'user_idx': userIdx})
        # 찾지 못하면
        else:
            return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})
    else: 
        return render_template('login.html')


## 모임 개설
@app.route('/workout/register', methods=['POST'])
def registerWorkout():
    user_idx_receive = request.form['user_idx']
    title_receive = request.form['title']
    place_receive = request.form['place']
    time_receive = request.form['time']
    category_receive = request.form['category']
    maximum_receive = request.form['maximum']

    token = request.headers.get('Authorization') # 토큰 정보 가져오기 
    
    # 토큰이 유효할 경우
    if token:
        new_workout = {
            'workout_idx': Util.get_next_sequence('workout', 'workout_idx'),
            'host_user_idx': int(user_idx_receive), #int로 치환
            'host_user_class': Util.getHostUserClass(int(user_idx_receive)),
            'title': title_receive, 
            'place': place_receive, 
            'time': time_receive, 
            'category': category_receive, 
            'image_url': Util.getCategoryImageUrl(category_receive),
            'maximum': int(maximum_receive), #int로 치환
            'current_people': 1,
            'participants': [],
        }
        try:
            collection_workout.insert_one(new_workout)
            return jsonify({'result': 'success'})
        except Exception as e:
            print(f"Error register Workout: {e}")
            return jsonify({'result': 'fail', 'msg': e})
    # 토큰이 유효하지 않으면 
    else:
        return 'Token not found in headers', 401                                                                                                                                                                                         

if __name__ == '__main__':  
   app.run('0.0.0.0',port=8000,debug=True)
