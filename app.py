from flask import Flask, render_template, redirect, request, jsonify, datetime
from flask_jwt_extended import *
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient('localhost', 27017)  # mongoDB는 27017 포트로
db = client.jungle  # 'dbjungle'라는 이름의 db사용
collection_users = db.users  # collection_name

# 토큰 생성에 사용될 Secret Key를 flask 환경 변수에 등록
app.config.update(
    DEBUG = True,
    JWT_SECRET_KEY = "todaysWorkout"
)

SECRET_KEY = 'TODAYS_WORKOUT'

# JWT 확장 모듈을 flask 어플리케이션에 등록
jwt = JWTManager(app)

@app.route('/')
def home():
    return render_template('main.html')

## 회원가입
@app.route('/join', methods=['GET', 'POST'])
def join():
    if request.method == 'POST':
        id_receive = request.form['user_id']
        pw_receive = request.form['user_pw']
        name_receive = request.form['user_name']
        class_receive = request.form['user_class']

        collection_users.insert_one({'id': id_receive, 'pw': pw_receive, 
        'name': name_receive, 'class': class_receive})

        payload = {
            'id': id_receive,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=5)    #언제까지 유효한지
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return redirect('/', {'result': 'success', 'token': token})
    else:
        render_template('join.html')
        

## 로그인
@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        # 클라이언트로부터 데이터 받기
        id_receive = request.form['id']
        pw_receive = request.form['pw']

        # id, pw을 가지고 해당 유저를 찾습니다.
        result = db.user.find_one({'id': id_receive, 'pw': pw_receive})

        # 찾으면 JWT 토큰을 만들어 발급
        if result is not None:
            # JWT 토큰에는, payload와 시크릿키가 필요합니다.
            # 시크릿키가 있어야 토큰을 디코딩(=풀기) 해서 payload 값을 볼 수 있습니다.
            # 아래에선 id와 exp를 담았습니다. 즉, JWT 토큰을 풀면 유저ID 값을 알 수 있습니다.
            # exp에는 만료시간을 넣어줍니다. 만료시간이 지나면, 시크릿키로 토큰을 풀 때 만료되었다고 에러가 납니다.
            payload = {
                'id': id_receive,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=5)    #언제까지 유효한지
            }
            #jwt를 암호화
            # token = jwt.encode(payload, SECRET_KEY, algorithm='HS256').decode('utf-8')
            token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

            # token을 줍니다.
            return redirect('/', {'result': 'success', 'token': token})
        # 찾지 못하면
        else:
            return jsonify({'result': 'fail', 'msg': '아이디/비밀번호가 일치하지 않습니다.'})
    else: 
        render_template('login.html')


if __name__ == '__main__':  
   app.run('0.0.0.0',port=8000,debug=True)
