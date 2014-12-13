function Time() {
    this.hours = 30;
    this.minutes = 0;
    this.seconds = 0;
}

function n(n){
    return n > 9 ? "" + n: "0" + n;
}

function reset() {
    var time = new Time();
    localStorage.time = JSON.stringify(time);
    remaining.innerHTML = n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds);
    if (working === true) {
        start();
    }
    return time;
}

function count() {
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
    localStorage.time = JSON.stringify(time);
    remaining.innerHTML = n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds);
    if (time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0 && override === false) {
        alert('Time to stop working!')
        start();
    }
}

function start() {
    if (working === false) {
        if (time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0) {
            alert('You are out of time.');
        } else {
            interval = setInterval(function() {count();}, 1000);
            working = true;
            button.style.background = 'red';
            button.innerHTML = 'Stop working';
            window.onbeforeunload = function (e) {
                return 'Your work time will not be tracked if you choose to leave this page.';
            }
        }
    } else {
        clearInterval(interval);
        working = false;
        button.style.background = 'green';
        button.innerHTML = 'Start working';
        window.onbeforeunload = null;
   	}
}

if (!(localStorage.time)) var time = reset();
else var time = JSON.parse(localStorage.time);
var remaining = document.getElementById('remaining');
remaining.innerHTML = n(time.hours) + ':' + n(time.minutes) + ':' + n(time.seconds);
var button = document.getElementById('work');
if (time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0) button.style.background = 'red';
var interval, working;
working = false;
var override = false;
button.onclick = function () {start();};
var reset_button = document.getElementById('reset');
reset_button.onclick = function () {
    var con = confirm('Are you sure you want to reset the week? You will lose the information about the amount of work time remaining.');    
    if (con === true) time = reset();
};
