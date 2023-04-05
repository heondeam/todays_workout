class Login {

    http;
    userInfo;

    constructor(httpService) {
        this.http = httpService;

        this.render();
        this.loadEvents();
    }

    /**
     * 기본 템플릿 렌더
     */
    render() {
        let template = `
        <div class="login-head-text">
            Today's Workout
        </div>
        <div class="login-content">
            <div class="login-header">
                <div class="login-text">
                    오우난오운완💪🏻
                </div>
            </div>
            <div class="login-form">
                <label class="custom-input-label" for="user_id">
                    <input class="custom-input-text" id="user-id" type="text" placeholder="아이디를 입력해주세요">
                </label>
                <label class="custom-input-label" for="user_pw">
                    <input class="custom-input-text" id="user-pw" type="password" placeholder="비밀번호를 입력해주세요">
                </label>

                <div class="btn-wrap">
                    <button id="login-btn" class="btn">로그인</button>
                    <button id="join-btn" class="btn">회원가입</button>
                </div>
            </div>
        </div>`;

        $(".login-wrap").append(template);
    }

    /**
     * 이벤트 바인딩
     */
    loadEvents() {
        $("#login-btn").click(() => { 
            this.login(); 
        });

        $("#join-btn").click(() => {
            window.location.replace("/join");
        });

        $("#user-id").keydown((e) => {
            if(e.keyCode === 13) {
                this.login();
            }
        });

        $("#user-pw").keydown((e) => {
            if(e.keyCode === 13) {
                this.login();
            }
        });
    }

    /**
     * 로그인
     */
    async login() {
        const userInfo = {
            user_id: $("#user-id").val(),
            user_pw: $("#user-pw").val()
        }

        if(userInfo.user_id === "") {
            window.alert("아이디를 입력해주세요.");
            return;
        }

        if(userInfo.user_pw === "") {
            window.alert("비밀번호를 입력해주세요");
            return;
        }

        try {
            const res = await this.http.request("login", "POST", {
                ...userInfo
            });

            if(res.result === "success") {
                this.handleToken(res.token);
                this.handleUserInfo(res.user_idx);
                location.replace("/");
            }else {
                window.alert(res.msg);
            }
        }catch (e) {
            console.log(e);
        }
    }

    /**
     * set token to sessionStorage
     */
    handleToken(token) {
        const isExist = sessionStorage.getItem("token");

        if(isExist) {
            sessionStorage.removeItem("token");
        }else {
            sessionStorage.setItem("token", token);
        }
    }

    /**
     * 로그인 정보 저장
     * @param idx 
     */
    handleUserInfo(idx) {
        const isExist = Number(JSON.parse(localStorage.getItem("info"))) > 0 ? true : false;
        
        if(isExist) localStorage.clear();
        localStorage.setItem("info", JSON.stringify({"user_idx" : idx}));
    }
}

export default Login;