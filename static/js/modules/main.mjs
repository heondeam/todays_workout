class Main {

    http;
    userInfo;
    isShow;

    constructor(httpService) {
        this.http = httpService;

        this.render();
        this.loadEvents();
        this.loadFeed();
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
                        <i class="fal fa-home-lg-alt fa-lg"></i>
                    </div>
                </div>
                <div class="nav-menu-item">
                    <div class="nav-menu-item-content plus-btn">
                        <i class="fal fa-plus fa-lg"></i>
                    </div>
                </div>
            </div>
            <div class="nav-exit-btn logout-btn">
                <i class="far fa-lock-open-alt fa-lg"></i>
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
            const user = Number(this.http.getUserInfo());
            const res = await this.http.request("/workout", "GET");

            if(res.result === "success") {
                const data = res.data

                res.workouts.forEach((item) => {
                    let template = `
                    <div id="workout-${item.host_user_idx}" class="main-content">
                        <div class="content-header">
                            <p>
                                <span>${item.host_user_name}</span>
                            </p>
                            <p>${item.title}</p>
                            <p>${item.current_people}/${item.maximum}</p>
                        </div>
                        <div class="content-body">
                            <img class="content-img" src=${item.image_url}>
                            <div class="content-right">
                                <div class=content-text-wrap>
                                    <p>장소 : ${item.place}</p>
                                    <p>시간 : ${item.time}</p>
                                    <p>종목 : ${item.category}</p>
                                </div>
                                <div class="content-btn-wrap">
                                    <button class="list-btn">목록</button>
                                    ${user == item.host_user_idx ? "<button class='delete-btn'>삭제</button>" :  "<button class='join-btn'>참여</button>"}
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
            user_idx: JSON.parse(localStorage.getItem("info")).user_idx,
            title: $("#title").val(),
            place: $("#place").val(),
            time: $("#date").val() + " " + $("#time").val(),
            category: $("#category").val(),
            maximum: $("#maximum").val(),
        };

        if(workout.title === "") {
            window.alert("모임 이름을 입력해주세요.");
            return;
        }

        if(workout.place === "") {
            window.alert("장소를 입력해주세요.");
            return;
        }

        if($("#date").val() === "") {
            window.alert("날짜를 선택해주세요.");
            return;
        }

        if($("#time").val() === "") {
            window.alert("시간을 선택해주세요.");
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


        try {
            const res = await this.http.request("workout/register", "POST", {
                ...workout
            }, true);

            if(res.result === "success") {
                window.alert("모임이 성공적으로 등록되었습니다.");
                this.hideCreateModal();
                window.location.reload();
            }
        } catch(e) {
            console.log(e);
        }
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
                <label class="custom-input-label" for="date">
                    <input class="custom-input-text" id="date" type="date" placeholder="날짜">
                </label>
                <label class="custom-input-label" for="time">
                    <input class="custom-input-text" id="time" type="time" placeholder="날짜">
                </label>
                <label class="custom-input-label" for="category">
                    <select id="category" class="custom-input-text">
                        <option value="">종목을 선택해주세요.</option>
                        <option value="walk">공원 산책</option>
                        <option value="running">러닝</option>
                        <option value="badminton">배드민턴</option>
                        <option value="football">풋살</option>
                        <option value="basketball">농구</option>
                        <option value="weight">웨이트 트레이닝</option>
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