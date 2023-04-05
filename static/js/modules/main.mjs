class Main {

    http;
    userInfo;
    isShow;

    constructor(httpService) {
        this.http = httpService;

        this.render();
        this.loadEvents();
        // 피드 불러오기
        // this.loadFeed();
    }

    render() {
        let template = `
        <div class="nav-wrap">
            <div class="nav-image">
                오우난오운완
            </div>
            <div class="nav-menu">
                <div class="nav-menu-item">
                    <div class="nav-menu-item-content home-btn">
                        <i data-feather="home"></i>
                    </div>
                </div>
                <div class="nav-menu-item">
                    <div class="nav-menu-item-content plus-btn">
                        <i data-feather="plus"></i>
                    </div>
                </div>
            </div>
            <div class="nav-exit-btn logout-btn">
                <i data-feather="lock"></i>
            </div>
        </div>

        <div class="main-content-wrap"></div>
        `;

        $(".main-wrap").append(template);
    }

    loadEvents() {
   
        // 로그아웃
        $(".logout-btn").click(() => {
            if(window.confirm("로그아웃 하시겠습니까?")) {
                this.http.logout();
            }
        });

        // 팝업창 생성 (모임 등록, 참여자 목록 조회)
        $(".plus-btn").click(() => {
            this.showCreateModal();
        });

    }

    /**
     * 피드 불러오기
     */
    async loadFeed() {
        $(".main-content-wrap").empty();

        try {
            const res = await this.http.request("/", "GET");

            if(res.result === "success") {
                res.data.forEach((item) => {
                    let template = `
                    <div class="main-content">
                        <div class="content-header">
                            <p>이성헌</p>
                            <p>방제목</p>
                            <p>13/15</p>
                        </div>
                        <div class="content-body">
                            <div class="content-img">
                                <img src="">
                            </div>
                            <div class="content-right">
                                <div class=content-text-wrap>
                                    <p>장소 : ddd</p>
                                    <p>시간 : ddd</p>
                                    <p>종목 : ddd</p>
                                </div>
                                <div class="content-btn-wrap">
                                    <button>목록</button>
                                    <button>참여</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    $(".main-content-wrap").append(template);
                });
            }else {
                window.alert(res.msg);
            }
        }catch(e) {
            console.log(e);
        }
    }

    /**
     * 모임 개설
     */
    async create() {
        const workout = {
            user_idx: 0,
            title: $("#title").val(),
            place: $("#place").val(),
            time: $("#time").val(),
            category: $("#category").val(),
            class: $("#maximum").val(),
        };

        if(workout.title === "") {
            window.alert("모임 이름을 입력해주세요.");
            return;
        }

        if(workout.place === "") {
            window.alert("장소를 입력해주세요.");
            return;
        }

        if(workout.date === "") {
            window.alert("날짜를 선택해주세요.");
            return;
        }

        if(workout.category === "") {
            window.alert("운동 종목을 선택해주세요.");
            return;
        }

        if(workout.maximum === "") {
            window.alert("인원을 선택해주세요.");
            return;
        }

        // try {
        //     const res = await this.http.request("workout/register", "POST", {
        //         ...workout
        //     });

        //     if(res.result === "success") {
        //         window.alert("모임이 성공적으로 등록되었습니다.");
        //         this.hideCreateModal();
        //     }
        // } catch(e) {
        //     console.log(e);
        // }
    }

    /**
     * 모달창 생성
     */
    showCreateModal() {
        const isShow = [...$(".main-content-wrap").children()].some((child) => {
            if(child.className === "modal-wrap") {
                return true;
            }
        });

        let template = `
        <div class="modal-wrap">
            <div class="modal-header">
                모임개설
            </div>
            <div class="modal-body">
                <label class="custom-input-label" for="title">
                    <input class="custom-input-text" id="title" type="text" placeholder="방이름">
                </label>
                <label class="custom-input-label" for="place">
                    <input class="custom-input-text" id="place" type="text" placeholder="장소">
                </label>
                <label class="custom-input-label" for="time">
                    <input class="custom-input-text" id="time" type="date" placeholder="날짜">
                </label>
                <label class="custom-input-label" for="category">
                    <select id="category" class="custom-input-text">
                        <option value="">종목을 선택해주세요.</option>
                        <option value="soccer">공원 산책</option>
                        <option value="blue">러닝</option>
                        <option value="green">배드민턴</option>
                        <option value="green">풋살</option>
                        <option value="green">농구</option>
                        <option value="green">웨이트 트레이닝</option>
                    </select>
                </label>
                <label class="custom-input-label" for="maximum">
                    <select id="maximum" class="custom-input-text">
                        <option value="">인원을 선택해주세요.</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </label>
            </div>
            <div class="modal-footer">
                <button class="create-btn">개설하기</button>
                <button class="cancle-btn">취소</button>
            </div>
        </div>
        `;

        if(isShow) {
            this.isShow = false;
            this.hideCreateModal();
        }else {
            this.isShow = true;

            $(".main-content-wrap").append(template);

            $(".create-btn").click(() => {
                this.create();
            });

            $(".cancle-btn").click(() => {
                this.hideCreateModal();
            });
        }
    }

    hideCreateModal() {
        $(".modal-wrap").remove();
    }
}

export default Main;