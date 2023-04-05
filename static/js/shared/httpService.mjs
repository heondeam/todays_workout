class HttpService {
    // root url
    $rootUrl
    // http headers
    $headers

    constructor(url) {
        this.$rootUrl = `http://${url}`;
        this.$headers = {
            "Content-Type": "application/json"
        }
    }

    /**
     * http request
     * @param url 
     * @param method 
     * @param data 
     * @returns 
     */
    request(url, method, data, token) {
        console.log(sessionStorage.getItem("token"));

        return $.ajax({
            type: method,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", sessionStorage.getItem("token"));
            },
            url: url,
            data: data,
            dataType: "json"
        });
    }

    /**
     * 토큰 유효성 검사
     */
    auth() {
        const isExist = sessionStorage.getItem("token");

        if(isExist) {
            return true;
        }else {
            return false;
        }
    }

    /**
     * 유저 정보 얻기
     */
    getUserInfo() {
        return JSON.parse(localStorage.getItem("info")).user_idx;
    }

    /**
     * 로그아웃
     */
    logout() {
        sessionStorage.clear();
        localStorage.clear();
        window.location.replace("/login");
    }
}

export default HttpService;