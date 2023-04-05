import HttpService from "./shared/httpService.mjs";
import Login from "./modules/login.mjs";
import Join from "./modules/join.mjs";
import Main from "./modules/main.mjs";

let login;
let join;
let main;

$(document).ready(() => {
    if(window.location.pathname === "/login") {
        login = new Login(new HttpService("localhost:5000"));
    }else if(window.location.pathname === "/join") {
        join = new Join(new HttpService("localhost:5000"));
    }else if(window.location.pathname === "/") {
        main = new Main(new HttpService("localhost:5000"));
    }
});