class HttpService {
    // root url
    $rootUrl
    // http headers
    $headers
    // token
    set token(value) {
        sessionStorage
    }
    tokenValue;

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
    request(url, method, data) {
        return $.ajax({
            type: method,
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
     * 로그아웃
     */
    logout() {
        sessionStorage.clear();
        window.location.replace("/login");
    }
}

export default HttpService;