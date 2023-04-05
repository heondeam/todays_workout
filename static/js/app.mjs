import HttpService from "./shared/httpService.mjs";
import Login from "./modules/login.mjs";
import Join from "./modules/join.mjs";
import Main from "./modules/main.mjs";

let login;
let join;
let main;

/**
 * user page checkToken
 */
const checkTokenUser = () => {
    console.log("is run?")

    const isExist = sessionStorage.getItem("token");

    if(isExist) {
        window.alert("이미 로그인되어 있습니다!!");
        window.location.replace("/");

        return false;
    }else {
        return true;
    }
}

/**
 * main page checkToken
 */
const checkTokenMain = () => {
    const isExist = sessionStorage.getItem("token");

    if(isExist) {
        return true;
    }else if(!isExist) {
        window.alert("로그인 후 이용해주세요");
        window.location.replace("/login");

        return false;
    }
}


$(document).ready(() => {
    if(window.location.pathname === "/login") {
        if(checkTokenUser()) {
            login = new Login(new HttpService("localhost:5000"));
        }
    }else if(window.location.pathname === "/join") {
        if(checkTokenUser()) {
            join = new Join(new HttpService("localhost:5000"));
        }
    }else if(window.location.pathname === "/") {
        if(checkTokenMain()) {
            main = new Main(new HttpService("localhost:5000"));
        }
    }

    window.onpageshow = function(event) {
        if ( event.persisted || (window.performance && window.performance.navigation.type == 2)) {
            // Back Forward Cache로 브라우저가 로딩될 경우 혹은 브라우저 뒤로가기 했을 경우
            // 이벤트 추가하는 곳

            if(window.location.pathname === "/login") {
                if(checkTokenUser()) {
                    login = new Login(new HttpService("localhost:5000"));
                }
            }else if(window.location.pathname === "/join") {
                if(checkTokenUser()) {
                    join = new Join(new HttpService("localhost:5000"));
                }
            }else if(window.location.pathname === "/") {
                if(checkTokenMain()) {
                    main = new Main(new HttpService("localhost:5000"));
                }
            }
        }
    }

});