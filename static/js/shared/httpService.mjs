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
    request(url, method, data) {
        return $.ajax({
            type: method,
            url: url,
            data: data,
            dataType: "json"
        });
    }
}

export default HttpService;