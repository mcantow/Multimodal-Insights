// INIT speech recognition object
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;

var recording = false;



// TRACK MOUSE MOVEMENT
const mousePosText = document.getElementById('mouse-pos');
let mousePos = { x: undefined, y: undefined };
window.addEventListener('mousemove', (event) => {
  mousePos = { x: event.clientX, y: event.clientY };
});

// TRACK GAZE POSITION
let gazePos = { x: undefined, y: undefined };
webgazer.setGazeListener(function(data, elapsedTime) {
	if (data == null) {
		return;
	}
	var xprediction = data.x; //these x coordinates are relative to the viewport
	var yprediction = data.y; //these y coordinates are relative to the viewport
	// console.log(elapsedTime); //elapsed time is based on time since begin was called
    gazePos = {x:xprediction, y:yprediction}
}).begin();



// SET RECOGNITION OBJECT ACTIONS
document.addEventListener('DOMContentLoaded', function () {
    // var diagnostic = document.querySelector('.output');
    var terminal = document.getElementById('terminal');
    var readyNotification = document.createElement('div');
    terminal.appendChild(readyNotification);
    readyNotification.innerText = 'Load successfull, ready for input.';
    readyNotification.classList.add('initCommand');

    document.onclick = function() {
        if (!recording){
            recognition.start();
            recording = true;
            console.log('listening');
            document.getElementById('status').innerText = 'Listening For Command';
            document.getElementById('status').classList.add('active');
        }else{
            recognition.stop();
            recording = false;
            document.getElementById('status').innerText = 'Not Listening';
            document.getElementById('status').classList.remove('active');
        }
    }
    recognition.onresult = function(event) {
        updateQueriedField(event.results);
        console.log(event.results);
        // moveBlock();
        // var color = event.results[0][0].transcript;
        // console.log('Confidence: ' + event.results[0][0].confidence);
    }
    recognition.onspeechend = function() {
        var resNotification = document.createElement('div');
        terminal.appendChild(resNotification);
        resNotification.innerText = '> ' + queriedField;
        resNotification.classList.add('command');
        terminal.scrollTop = terminal.scrollHeight;
        recognition.stop();
        recording = false;
        document.getElementById('status').innerText = 'Not Listening';
        document.getElementById('status').classList.remove('active');
    }
    recognition.onnomatch = function(event) {
        // diagnostic.textContent = "I didn't recognise that color.";
    }
    recognition.onerror = function(event) {
        // diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    }
});



// KEEP TRACK OF CURRENT QUERY FIELD
var dataFields = ['revenue', 'completed sales', 'customer conversations', 'win rate'];
var queriedField = 'none';

function updateQueriedField(results){
    /**
     * Keeps a running log of most recent queried field.
     * Updated after each recognition result
     * @param {[SpeechRecognitionResultList]} results [current results]
     * @return {[null]} [updates the global variable queriedFields]
     */
    var res = results[0][0].transcript;
    res = res.toLowerCase();
    // alert(res)
    for (var i=0; i<dataFields.length; i++){
        if (res.includes(dataFields[i])){
            queriedField = dataFields[i];
        }
    }
}

function getFullQueryString(results){
    /**
     * Gets the string of the full query
     * @param {[SpeechRecognitionResultList]} results [current results]
     * @return {[string]} [the full query]
     */
    var res = '';
    for (var i=0; i<results.length; i++){
        var color = results[0][0].transcript;
    }
}



// DEBUG
// function moveBlock(){
//     let block = document.getElementById('block');
//     console.log(mousePos);
//     console.log(gazePos);
//     block.style.left = gazePos.x + 'px';
//     block.style.top = gazePos.y + 'px';
// }