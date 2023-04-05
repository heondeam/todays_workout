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
        if(checkTokenUser() && !login) {
            login = new Login(new HttpService("localhost:5000"));
        }
    }else if(window.location.pathname === "/join" && !join) {
        if(checkTokenUser()) {
            join = new Join(new HttpService("localhost:5000"));
        }
    }else if(window.location.pathname === "/" &&  !main) {
        if(checkTokenMain()) {
            main = new Main(new HttpService("localhost:5000"));
        }
    }
});