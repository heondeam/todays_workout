import HttpService from "./shared/httpService.mjs";
import User from "./modules/user.mjs";

let user;

const loadPages = () => {
    let templates;
    const nowPathName = window.location.pathname;

    console.log("[nowPathName] :" , nowPathName);

    switch (nowPathName) {
        case "/join" :
            templates = `
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
                        <p class="valid-text">중복된 아이디 입니다.</p>
                        <label class="custom-input-label" for="user-pw">
                            <input id="user-pw" class="custom-input-text" type="password"  placeholder="비밀번호를 입력해주세요.">
                        </label>
                        <label class="custom-input-label" for="user-pw-confirm">
                            <input id="user-pw-confirm" class="custom-input-text" type="password"  placeholder="비밀번호를 확인해주세요.">
                        </label>
                        <p class="valid-text">비밀번호가 일치하지 않습니다.</p>
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
                </div>
            `;
            break;
        case "/login":
            templates = `
                <div class="login-content">
                    <div class="login-header">
                        <div class="login-image">
                            이미지
                        </div>
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
                </div>
            `;
            break;
        case "/":
            templates = `
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
            break;
    }

    $(".wrap").append(templates);
}

$(document).ready(() => {
    loadPages();
    user = new User(new HttpService("localhost:5000"));
});