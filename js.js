function Time() {
    var date = new Date();
    this.hours = 1;
    this.minutes = 0;
    this.seconds = 0;
    this.countDown = true;
    this.lastReset = toDays(date.getTime());
    this.absSeconds = toAbsSecs(this.hours, this.minutes, this.seconds);
    this.maxSeconds = this.absSeconds;
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
    function newTime() {
        var hrsMinsSecs = toHrsMinsSecs(time.absSeconds);
        time.hours = hrsMinsSecs[0];
        time.minutes = hrsMinsSecs[1];
        time.seconds = hrsMinsSecs[2];
    }
    if (time.countDown === true) {
        time.absSeconds--;
        newTime();
    } else {
        time.absSeconds++;
        newTime();
    }
    updateBar();
    localStorage.time = JSON.stringify(time);
    if (time.absSeconds <= 0 && time.countDown === true) {
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

function toHrsMinsSecs(seconds) {
    hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    return [hours, minutes, seconds];
}

function toAbsSecs(hours, minutes, seconds) {
    return hours * 3600 + minutes * 60 + seconds;
}

function updateBar() {
    ctx.clearRect(0, 0, cwidth, cheight);
    if (time.countDown === true) {
        divide = time.absSeconds / time.maxSeconds * cwidth;
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, divide, cheight);
        ctx.fillStyle = 'red';
        ctx.fillRect(divide, 0, cwidth - divide, cheight);
    } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, cwidth, cheight);
    }
    ctx.fillStyle = 'white';
    if (time.countDown === true) ctx.fillText(n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds), cwidth / 2, cheight / 2);
    else ctx.fillText('-' + n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds), cwidth / 2, cheight / 2);
}

var remaining = document.getElementById('remaining');
var button = document.getElementById('work');
var body = document.getElementById('body');
//var reset_button = document.getElementById('reset');
var interval, working;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var cwidth = 294;
var cheight = 32;

working = false;
button.onclick = function () {start();};
/*reset_button.onclick = function () {
    var con = confirm('Are you sure you want to reset the week? You will lose the information about the amount of work time remaining.');    
    if (con === true) time = reset();
};*/

if (!(localStorage.time)) var time = reset();
else {
    var time = JSON.parse(localStorage.time);
    if (time.absSeconds <= 0 || time.countDown === false) {
        body.style.background = '#CC297A';
    }
    var date = new Date();
    if (toDays(date.getTime()) > time.lastReset + date.getDay()) {
        var time = reset();
    }
}

ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.font = '20px Sans';

updateBar();
