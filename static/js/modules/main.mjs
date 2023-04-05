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

    /**
     * 기본 템플릿 렌더
     */
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

    /**
     * 이벤트 바인딩
     */
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
     * 피드 불러오기 (무한 스크롤)
     */
    async loadFeed() {
        $(".main-content-wrap").empty();

        // user idx find
        const user = Number(this.http.getUserInfo());
        let workout = [];
        let isLoading = false;
        let nowPage = 1;

        try {
            const res = await this.http.request("/workout", "GET", {
                "page" : 1
            }, true);

            if(res.result === "success" && res.workouts.length > 0) {
                workout = [];

                res.workouts.forEach((item) => {
                    let isPaticipate = item.participants.find(item => item.user_idx === user);

                    workout.push(item);

                    let template = `
                    <div id="${'workout-' + item.workout_idx}" class="main-content">
                        <div class="content-header">
                            <p>
                                <span style="background-color: ${item.host_user_class};">${item.host_user_name}</span>
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
                                    ${user === item.host_user_idx ? "<button class='delete-btn'>삭제</button>" : ""}
                                    ${user !== item.host_user_idx ? (isPaticipate ? "<button class='cancel-btn'>나가기</button>" : "<button class='join-btn'>참여</button>") : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    $(".main-content-wrap").append(template);
                });

                nowPage++;
            }else {
                window.alert("모임방이 존재하지 않습니다!");
            }         

            $(window).on("scroll", async () => {
                const bottomDistance = $(document).height() - $(window).height() - $(window).scrollTop();
    
                if (bottomDistance < 50 && !isLoading) {
                    isLoading = true;
    
                    const res = await this.http.request("/workout", "GET", {
                        "page": nowPage // Load the next page of content
                    }, true);

                    if (res.result === "success" && res.workouts.length > 0) {
                        res.workouts.forEach((item) => {
                            let isPaticipate = item.participants.find(item => item.user_idx === user);
        
                            workout.push(item);
                            let template = `
                            <div id="${'workout-' + item.workout_idx}" class="main-content">
                                <div class="content-header">
                                    <p>
                                        <span style="background-color: ${item.host_user_class};">${item.host_user_name}</span>
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
                                            ${user === item.host_user_idx ? "<button class='delete-btn'>삭제</button>" : ""}
                                            ${user !== item.host_user_idx ? (isPaticipate ? "<button class='cancel-btn'>나가기</button>" : "<button class='join-btn'>참여</button>") : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `;
                            $(".main-content-wrap").append(template);
                        });

                        isLoading = false;
                        nowPage++;
                    } else {
                        return;
                    }
                }
            });
        }catch(e) {
            console.log(e);
        }

        // Add click event to parent element
        $(".main-content-wrap").on("click", ".delete-btn, .join-btn, .list-btn, .cancel-btn", async function() {
            const workoutId = $(this).closest(".main-content").attr("id").split("-")[1];

            if ($(this).hasClass("delete-btn")) {
                // Call deleteWorkout function
                await deleteWorkout(workoutId);
            } else if ($(this).hasClass("join-btn")) {
                // Call joinWorkout function
                await joinWorkout(workoutId);
            } else if ($(this).hasClass("list-btn")) {
                // Call showListModal function
                await showListModal(workoutId);
            } else if ($(this).hasClass("cancel-btn")) {
                // Call cancelWorkout
                await cancelWorkout(workoutId);
            }
        });

        // 모임 삭제 (바인딩)
        const deleteWorkout = async (idx) => {
            if(window.confirm("해당 모임을 삭제하시겠습니까?")) {
                const res = await this.http.request("/workout", "DELETE", {
                    workout_idx: idx
                }, true);

                try {
                    if(res.result === "success") {
                        window.alert("성공적으로 삭제되었습니다.");
                        window.location.reload();
                    }else {
                        window.alert(res.msg)
                    }
                } catch(e) {
                    console.log(e);
                }
            }
        }

        // 참여 기능
        const joinWorkout = async (idx) => {
            if(window.confirm("해당 모임에 참여하시겠습니까?")) {
                const res = await this.http.request("/workout/join", "POST", {
                    user_idx: user,
                    workout_idx: idx
                }, true);

                try {
                    if(res.result === "success") {
                        window.location.reload();
                    }
                }catch(e) {
                    console.log(e);
                }
                
            }
        }

        // 참여 취소 기능
        const cancelWorkout = async (idx) => {
            if(window.confirm("해당 모임에서 나가시시겠습니까?")) {
                const res = await this.http.request("/workout/join", "DELETE", {
                    user_idx: user,
                    workout_idx: idx
                }, true);

                try {
                    if(res.result === "success") {
                        window.location.reload();
                    }
                }catch(e) {
                    console.log(e);
                }
                
            }
        }

        /**
         * 참여자 목록 모달 생성
         */
        const showListModal = (idx) => {
            const selectedData = workout.find(item => item.workout_idx == idx);

            const isShow = [...$(".main-content-wrap").children()].some((child) => {
                if(child.className === "list-modal-wrap") {
                    return true;
                }
            });
    
            let template = `
            <div class="list-modal-wrap">
                <div class="modal-header">
                    참여자 목록
                </div>
                <div class="list-modal-body"></div>
                <div class="list-modal-footer">
                    <button class="dismiss-btn">닫기</button>
                </div>
            </div>
            `;
    
            if(isShow) {
                this.isShow = false;
                hideListModal();
            }else {
                this.isShow = true;
    
                $(".main-content-wrap").append(template);

                selectedData.participants.forEach(item => {
                    $(".list-modal-body").append(
                        `<div style="background-color: ${item.user_class}" class="participants-name">${item.user_name}</div>`
                    )
                })
                
                $(".dismiss-btn").click(() => {
                    hideListModal();
                });
            }
        }            

        const hideListModal = () => {
            $(".list-modal-wrap").remove();
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
     * 모임 생성 모달창 생성
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

    /**
     * 모임 생성 모달창 숨김
     */
    hideCreateModal() {
        $(".modal-wrap").remove();
    }
}

export default Main;