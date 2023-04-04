class User {

    http;
    userInfo;
    token;

    constructor(httpService) {
        this.http= httpService;

        this.loadEvents();
    }


    /**
     * 이벤트 바인딩
     */
    loadEvents() {
        const nowPathName = window.location.pathname;

        if(nowPathName === "/login") {
            $("#login-btn").click(() => { 
                this.login(); 
            });

            $("#join-btn").click(() => {
                window.location.replace("/join");
            });
        }else if(nowPathName === "/join") {
            $("#join-btn").click(() => {
                this.join();
            });
        }
    }

    /**
     * 로그인
     */
    async login() {
        const userInfo = {
            user_id: $("#user-id").val(),
            user_pw: $("#user-pw").val()
        }

        try {
            const res = await this.http.request("login", "POST", {
                ...userInfo
            });

            if(res.result === "success") {
                console.log("로그인 성공!");
                this.handleToken(res.token);
                location.replace("/");
            }
        }catch (e) {
            console.log(userInfo);

            console.log(e);
        }
    }

    /**
     * 회원가입
     */
    async join() {
        const userInfo = {
            user_id: $("#user-id").val(),
            user_pw: $("#user-pw").val(),
            user_name: $("#user-name").val(),
            user_class: $("#user-class option:selected").val()
        }

        try { 
            const res = await this.http.request("join", "POST", {
                ...userInfo
            });

            if(res.result === "success") {
                window.alert("회원가입 성공!");
                this.handleToken(res.token);
                location.replace("/");
            }
        }catch(e) {
            console.log(e);
        }
    }

    /**
     * set token to sessionStorage
     */
    handleToken (token) {
        const isExist = sessionStorage.getItem("token");

        if(isExist) {
            sessionStorage.removeItem("token");
        }else {
            sessionStorage.setItem("token", token);
        }
    }

}

export default User