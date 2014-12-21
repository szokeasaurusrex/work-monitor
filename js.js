function Time() {
    var date = new Date();
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 5;
    this.countDown = true;
    this.lastReset = toDays(date.getTime());
}

function n(n){
    return n > 9 ? "" + n: "0" + n;
}

function reset() {
    var time = new Time();
    localStorage.time = JSON.stringify(time);
    remaining.innerHTML = n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds);
    button.style.background = 'green';
    if (working === true) {
        start();
    }
    return time;
}

function count() {
    if (time.countDown === true) {
        if (time.minutes == 0 && time.seconds == 0) {
            time.hours--;
            time.minutes = 59;
            time.seconds = 59;
        } else if (time.seconds == 0) {
            time.minutes--;
            time.seconds = 59;
        } else {
            time.seconds--;
        }
        remaining.innerHTML = n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds);
    } else {
        if (time.minutes == 59 && time.seconds == 59) {
            time.hours++;
            time.minutes = 0;
            time.seconds = 0;
        } else if (time.seconds == 59) {
            time.minutes++;
            time.seconds = 0;
        } else {
            time.seconds += 1;
        }
        remaining.innerHTML = '-' + n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds);
    }
    localStorage.time = JSON.stringify(time);
    if (time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0 && time.countDown === true) {
        body.style.background = '#CC297A';
        var cont = confirm('You are out of time. Working for an extended amount of time could have unexpected consequences. Are you sure you want to continue working?');
        if (cont === true) {
            if (time.countDown === true) time.countDown = false;
            start(true);
        } else {
            start();
        }
    }
}

function start(override) {
    function startCount() {
        clearInterval(interval);
        interval = setInterval(function() {count();}, 1000);
        working = true;
        button.style.background = 'red';
        button.innerHTML = 'Stop working';
        window.onbeforeunload = function (e) {
            return 'Your work time will not be tracked if you choose to leave this page.';
        }
    }
    if (override === true) startCount();
    else if (working === false) {
        if (time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0 || time.countDown === false) {
            var cont = confirm('You are out of time. Working for an extended amount of time could have unexpected consequences. Are you sure you want to start working?');
            if (cont === true) {
                if (time.countDown === true) time.countDown = false;
                startCount();
            }
        } else {
            startCount();
        }
    } else {
        clearInterval(interval);
        working = false;
        button.style.background = 'green';
        button.innerHTML = 'Start working';
        window.onbeforeunload = null;
   	}
}

function toDays(milliseconds) {
    return Math.floor(milliseconds / 86400000);
}

var remaining = document.getElementById('remaining');
var button = document.getElementById('work');
var body = document.getElementById('body');
//var reset_button = document.getElementById('reset');
var interval, working;

working = false;
button.onclick = function () {start();};
/*reset_button.onclick = function () {
    var con = confirm('Are you sure you want to reset the week? You will lose the information about the amount of work time remaining.');    
    if (con === true) time = reset();
};*/

if (!(localStorage.time)) var time = reset();
else {
    var time = JSON.parse(localStorage.time);
    if (time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0 || time.countDown === false) {
        body.style.background = '#CC297A';
    }
    var date = new Date();
    if (toDays(date.getTime()) > time.lastReset + date.getDay()) {
        var time = reset();
    }
}


if (time.countDown === true) remaining.innerHTML = n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds);
else remaining.innerHTML = '-' + n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds);
