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
        if value == 'football':
            return "https://image.fmkorea.com/files/attach/new/20181201/33854530/577002901/1420290663/b1830cd0a8207833c6baf5bacf2df039.jpg"
        if value == 'running':
            return "https://thumbor.bigedition.com/img/4S_0eyjdLZhEQo6lJjijIThz5P0=/0x0:1000x1500/480x720/filters:quality(80)/granite-web-prod/35/6f/356fb6960a1444ca839435c4ae20a0e2.jpeg"
        if value == 'walk':
            return "https://static01.nyt.com/images/2022/08/03/well/FITNESS-WALKING-MEALS/FITNESS-WALKING-MEALS-videoSixteenByNine3000.jpg"
        if value == 'basketball':
            return "https://nypost.com/wp-content/uploads/sites/2/2023/03/Sean-Bairstow-1-copy.jpg"
        if value == 'badminton':
            return "https://badminton-coach.co.uk/wp-content/uploads/2013/04/badminton-jump-smash2.jpg"
        if value == 'weight':
            return "https://i.imgflip.com/1y0ge4.jpg"
        else:
            return "https://cdn.huffingtonpost.kr/news/photo/201512/18818_36342.jpeg"

    # 유저 반 정보 가져오기
    def getUserClass(userIdx):
        user = db['users'].find_one({'user_idx': userIdx})
        return user['user_class']
    
    # 유저 이름 정보 가져오기
    def getUserName(userIdx):
        user = db['users'].find_one({'user_idx': userIdx})
        return user['user_name']
        
        


