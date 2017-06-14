var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
}

function connect() {
    var socket = new SockJS('/websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);

        $.get("populate", function (data, status) {
            startPoker(data.blind, new Date(data.nextBlindTime));
        });

        stompClient.subscribe('/topic/start', function (pokertext) {
            var parse = JSON.parse(pokertext.body);
            startPoker(parse.blind, new Date(parse.nextBlindTime));
        });
        stompClient.subscribe('/topic/stop', function () {
            stopPoker();
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    stopPoker();
    console.log("Disconnected");
}

function sendStart() {
    $.get("start", function (data, status) {
    });
}
function sendPause() {
    $.get("stop", function (data, status) {
    });
}


function startPoker(blind, nextBlindTime) {
    $("#bigblindssum").text(blind);
    $("#smallblindssum").text(blind / 2)

    var hours = nextBlindTime.getHours() < 10 ? "0" + nextBlindTime.getHours() : nextBlindTime.getHours();
    var minutes = nextBlindTime.getMinutes() < 10 ? "0" + nextBlindTime.getMinutes() : nextBlindTime.getMinutes();
    var seconds = nextBlindTime.getSeconds() < 10 ? "0" + nextBlindTime.getSeconds() : nextBlindTime.getSeconds();

    $("#nextraise").text(hours + ":" + minutes + ":" + seconds);
    startTimer(nextBlindTime, document.getElementById('clockdiv'));
}

function stopPoker() {
    resetIntervall();
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $("#connect").click(function () {
        connect();
    });
    $("#disconnect").click(function () {
        disconnect();
    });
    $("#start").click(function () {
        sendStart();
    });
    $("#pause").click(function () {
        sendPause();
    });
});

var g_intervall;
function startTimer(date, clock) {
    var diff,
        minutes,
        seconds,
        hours;

    function timer() {
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = ((date.getTime() + 1000) - Date.now()) / 1000;

        if (diff < 0) {
            diff = 0;
        }
        // does the same job as parseInt truncates the float
        hours = (diff / (60 * 60)) % 24 | 0;
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        hours = hours < 10 ? "0" + hours : hours;

        var hoursSpan = clock.querySelector('.hours');
        var minutesSpan = clock.querySelector('.minutes');
        var secondsSpan = clock.querySelector('.seconds');
        hoursSpan.innerHTML = hours;
        minutesSpan.innerHTML = minutes;
        secondsSpan.innerHTML = seconds;
    };
    // we don't want to wait a full second before the timer starts
    timer();
    resetIntervall();
    g_intervall = setInterval(timer, 1000);
}

function resetIntervall() {
    if (g_intervall) {
        clearInterval(g_intervall);
    }
}