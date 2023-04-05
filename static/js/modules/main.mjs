class Main {

    http;
    userInfo;

    constructor(httpService) {
        this.http = httpService;

        if(this.checkToken()) {
            this.render();
        }
    }

    render() {
        let template = `
        <div class="nav-wrap">
            <div class="nav-image">
                오우난오운완
            </div>
            <div class="nav-menu">
                <div class="nav-menu-item">
                    <div class="nav-menu-item-content">
                        <i data-feather="home"></i>
                    </div>
                </div>
                <div class="nav-menu-item">
                    <div class="nav-menu-item-content">
                        <i data-feather="plus"></i>
                    </div>
                </div>
            </div>
            <div class="nav-exit-btn">
                <i data-feather="lock"></i>
            </div>
        </div>

        <div class="main-wrap">
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
            <div class="main-content">
                12
            </div>
        </div>
        `;

        $(".wrap").append(template);
    }

    loadEvents() {
        // 피드 불러오기

        // 로그아웃

        // 팝업창 생성 (모임 등록, 참여자 목록 조회)
    }

    /**
     * 토큰 검증
     */
    checkToken() {
        const isExist = sessionStorage.getItem("token");

        if(isExist) {
            return true;
        }else if(!isExist) {
            window.alert("로그인 후 이용해주세요");
            window.location.replace("/login");

            return false;
        }
    }


}

export default Main;