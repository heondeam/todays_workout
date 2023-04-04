import requests
from flask import Flask, render_template, jsonify, request, make_response

app = Flask(__name__)

@app.route('/')
def main(): 
    return render_template('main.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/join')
def join():
    return render_template('join.html')

if __name__ == '__main__':
    app.run('0.0.0.0', port = 1443, debug = True)