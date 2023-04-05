class Join {

    http;
    userInfo;
    token;

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
        <div class="join-content">
            <div class="join-header">
                <div class="join-text">
                    회원가입
                </div>
            </div>
            <div class="join-form">
                <label class="custom-input-label" for="user-id">
                    <input id="user-id" class="custom-input-text" type="text" placeholder="아이디를 입력해주세요.">
                </label>
                <p class="valid-text valid-id">중복된 아이디 입니다.</p>
                <label class="custom-input-label" for="user-pw">
                    <input id="user-pw" class="custom-input-text" type="password"  placeholder="비밀번호를 입력해주세요.">
                </label>
                <label class="custom-input-label" for="user-pw-confirm">
                    <input id="user-pw-confirm" class="custom-input-text" type="password"  placeholder="비밀번호를 확인해주세요.">
                </label>
                <p class="valid-text valid-pw">비밀번호가 일치하지 않습니다.</p>
                <label class="custom-input-label" for="user-name">
                    <input id="user-name" class="custom-input-text" type="text" placeholder="이름을 입력해주세요.">
                </label>
                <label class="custom-input-label" for="user-class">
                    <select id="user-class" class="custom-input-text">
                        <option value="">선택없음</option>
                        <option value="red">레드</option>
                        <option value="blue">블루</option>
                        <option value="green">그린</option>
                    </select>
                </label>
            </div>
            <button id="join-btn" class="btn">완료</button>
        </div>`;

        $(".join-wrap").append(template);
    }

    /**
     * 이벤트 바인딩
     */
    loadEvents() {
        $("#join-btn").click(() => {
            this.join();
        });
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

        if(userInfo.user_id === "") {
            window.alert("아이디를 입력해주세요.");
            return;
        }

        if(userInfo.user_pw === "" || $("#user-pw-confirm").val() === "") {
            window.alert("비밀번호를 입력해주세요.");
            return;
        }

        if(userInfo.user_name === "") {
            window.alert("이름을 입력해주세요");
            return;
        }

        if(userInfo.user_class === "") {
            window.alert("클래스를 선택해주세요.");
            return;
        }

        if(userInfo.user_pw !== $("#user-pw-confirm").val()) {
            $(".valid-pw").show();
            return;
        }else {
            $(".valid-pw").hide();
        }

        try { 
            const res = await this.http.request("join", "POST", {
                ...userInfo
            });

            if(res.result === "success") {
                window.alert("회원가입 성공!");
                this.handleToken(res.token);
                this.handleUserInfo(res.user_idx);
                location.replace("/");
            }else {
                window.alert(res.msg);
            }
        }catch(e) {
            console.log(e);
        }
    }

    /**
     * check id
     */
    async checkUserId(id) {
        // id 유효성 검사
        const res = await this.http.request( "/check", "POST", {
            user_id: id
        });

        if(res.result === "success") {
            return true;
        }else {
            return false;
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

export default Join;