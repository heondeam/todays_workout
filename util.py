
class Util:
    ## 토큰 유효성 검사
    # def checkTokenValidation(token, functionSuccess):
    #     # 토큰이 유효할 경우
    #     if token: 
    #         try:
    #             functionSuccess
    #         # 토큰 관련 예외처리
    #         except jwt.exceptions.ExpiredSignatureError:
    #             return 'Token has expired', 401
    #         except jwt.exceptions.InvalidTokenError:
    #             return 'Invalid token', 401
    #     # 토큰이 유효하지 않으면 
    #     else:
    #         return 'Token not found in headers', 401

    def getCategoryImageUrl(value):
        if value == 'soccer':
            return "https://img.freepik.com/premium-photo/vertical-shot-soccer-ball-with-player-s-legs-waiting-kick-it_755989-104.jpg?w=2000"
        else:
            return "https://cdn.huffingtonpost.kr/news/photo/201512/18818_36342.jpeg"
        
        


