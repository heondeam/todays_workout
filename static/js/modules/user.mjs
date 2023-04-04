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
        if(window.location.pathname === "/login") {
            $("#login-btn").click(() => { this.login(); })
        }
    }


    /**
     * 로그인
     */
    async login() {
        const userId = $("#user_id").val();
        const userPw = $("#user_pw").val();


        console.log(userId, userPw);

        // try {
        //     const res = await this.http.request("login", "POST", {
        //         user_id: id,
        //         user_pw: password
        //     });

        //     if(res.result === "success") {
        //         console.log("로그인 성공!");
        //     }else {
        //         console.log(res.msg);
        //     }
        // }catch (e) {
        //     console.log(e);
        // }
    }


    /**
     * 회원가입
     */
    async join(userInfo) {
        try { 
            const res = await this.http.request("join", "POST", {
                ...userInfo
            });

            if(res.result === "success") {
                console.log("회원가입 성공!")
            }else {

                return console.log(res.result.msg);
            }
        }catch(e) {
            console.log(e);
        }


    }


}

export default User