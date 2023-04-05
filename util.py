from pymongo import MongoClient

client = MongoClient('localhost', 27017) 
db = client.jungle  

class Util:
    # auto increment - idx
    def get_next_sequence(collection_name, field_name):
        result = db['counters'].find_one_and_update(
            {'_id': collection_name},
            {'$inc': {field_name: 1}},
            upsert=True,
            return_document=True
        )
        return result[field_name]

    # 카테고리 이미지 가져오기
    def getCategoryImageUrl(value):
        if value == 'soccer':
            return "https://img.freepik.com/premium-photo/vertical-shot-soccer-ball-with-player-s-legs-waiting-kick-it_755989-104.jpg?w=2000"
        else:
            return "https://cdn.huffingtonpost.kr/news/photo/201512/18818_36342.jpeg"

    # 유저 반 정보 가져오기
    def getHostUserClass(userIdx):
        result = db['users'].find_one({'user_idx': userIdx})
        return result['user_class']
    
    # 유저 이름 정보 가져오기
    def getHostUserName(userIdx):
        result = db['users'].find_one({'user_idx': userIdx})
        return result['user_name']
        
        


