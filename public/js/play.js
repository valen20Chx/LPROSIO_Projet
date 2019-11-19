var socket = io();

// DOM Elements
var submit_connect = document.getElementById('connect-submit');
var txt_username = document.getElementById('txt-username');
var txt_roomcode = document.getElementById('txt-room-code');
var err_msg = document.getElementById('err-msg');

// XHTTP
var xhttp = new XMLHttpRequest();

submit_connect.addEventListener('click', (ev) => {
    if(txt_username.value === '') {
        err_msg.style.display = "block";
        err_msg.innerText = 'Username is empty';
        return;
    } else if(txt_roomcode.value === '') {
        err_msg.style.display = "block";
        err_msg.innerText = 'Room Code is empty';
    } else {
        // Connect
        window.location.pathname = "/help";
        console.log(window.location)
    }
});