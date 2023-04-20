// INIT speech recognition object
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 5;

var recording = false;


const NUM_DAYS = 10


// TRACK MOUSE MOVEMENT
const mousePosText = document.getElementById('mouse-pos');
let mousePos = { x: undefined, y: undefined };
window.addEventListener('mousemove', (event) => {
  mousePos = { x: event.clientX, y: event.clientY };
});

// TRACK GAZE POSITION
let gazePos = { x: undefined, y: undefined };
webgazer.setRegression('weightedRidge');
// webgazer.setRegression('linear');
let webgazerReady = false;
webgazer.setGazeListener(function(data, elapsedTime) {
	if (data == null) {
		return;
	}else{
        if (!webgazerReady){
            webgazerReady = true;
            var terminal = document.getElementById('terminal');
            var readyNotification1 = document.createElement('div');
            terminal.appendChild(readyNotification1);
            readyNotification1.innerText = '--> Gaze Tracker Ready.';
            readyNotification1.classList.add('initCommand');
            var readyNotification2 = document.createElement('div');
            terminal.appendChild(readyNotification2);
            readyNotification2.innerText = '--> Click then say "help" for more info.';
            readyNotification2.classList.add('initCommand');
        }
        var xprediction = data.x; //these x coordinates are relative to the viewport
        var yprediction = data.y; //these y coordinates are relative to the viewport
        // console.log(elapsedTime); //elapsed time is based on time since begin was called
        gazePos = {x:xprediction, y:yprediction}
    }
}).begin();



// SET RECOGNITION OBJECT ACTIONS
document.addEventListener('DOMContentLoaded', function () {
    var terminal = document.getElementById('terminal');
    var readyNotification = document.createElement('div');
    terminal.appendChild(readyNotification);
    readyNotification.innerText = '--> Voice Recognition Ready.';
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
        updateHelpCheck(event.results);
        updateSelectedPeople(event.results);
        updateDate(event.results);
        // moveBlock();
        // var color = event.results[0][0].transcript;
        // console.log('Confidence: ' + event.results[0][0].confidence);
    }
    // recognition.onspeechstart = function(){
    //     console.log('speech started');
    // }

    // recognition.onspeechend = function() {
    //     // console.log('speech ended');
    // }

    // recognition.onnomatch = function(event) {
    //     // diagnostic.textContent = "I didn't recognise that color.";
    // }

    // recognition.onerror = function(event) {
    //     // diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
    // }

    recognition.onend = function(event){
        recognition.stop();
        if (askedForHelp){
            var resNotification = document.createElement('div');
            terminal.appendChild(resNotification);
            resNotification.innerText = '--->  help';
            resNotification.classList.add('command');
            var responseNotification = document.createElement('div');
            terminal.appendChild(responseNotification);
            responseNotification.innerHTML = 
                '-----------------------------------------------<br>\
                -----------------------------------------------\
                Welcome to Multimodal Insights! <br>\
                See homepage for description.<br>-<br>\
                Queries must include a data field, a set of people, and a date range.<br>\
                New queries omitting an item will reuse the most recent item.<br>\
                Clicking the page will start recording audio input.<br>-<br>\
                The system tracks your eye gaze. Looking at the graphics to the right while speaking will improve results.<br>\
                -----------------------------------------------<br>\
                -----------------------------------------------';
            speakText(' Welcome to Multimodal Insights! See homepage for description.  Queries must include a data field, a set of people, and a date range.\
            New queries omitting an item will reuse the most recent item. Clicking the page will start recording audio input.\
            The system tracks your eye gaze. Looking at the graphics to the right while speaking will improve results')
            responseNotification.classList.add('response');
            responseNotification.classList.add('help');
            terminal.scrollTop = terminal.scrollHeight;
            askedForHelp = false;
            personHeard = false;
            recording = false;
        }else{
            var resNotification = document.createElement('div');
            terminal.appendChild(resNotification);
            var currPeopleValid = false;
            var queriedFieldValid = false;
            var dateRangeValid = false;
            if (currPeopleList.length > 0){
                resNotification.innerText = '> { '+ currPeopleList.join(', ') +' }, ';
                currPeopleValid = true;
            }else{
                resNotification.innerText = '> {no people selected}, ';
            }
            if (queriedField != 'none'){
                queriedFieldValid = true;
                resNotification.innerText = resNotification.innerText + ' ' + queriedField;
            }else{
                resNotification.innerText = resNotification.innerText + ' no command';
            }
            if( start_date != 'none'){
                dateRangeValid = true;
                resNotification.innerText = resNotification.innerText + ', ' + start_date;
                if (end_date != 'none'){
                    resNotification.innerText = resNotification.innerText + '-' + end_date;
                }
                makeDateBar();
            }
            resNotification.classList.add('command');
            var responseNotification = document.createElement('div');
            terminal.appendChild(responseNotification);
            if (!currPeopleValid || !queriedFieldValid){
                responseNotification.innerHTML = 'REQUIRED QUERY ITEMS<br>';
                responseNotification.innerHTML = responseNotification.innerHTML + '| people ';
                responseNotification.innerHTML = responseNotification.innerHTML + '| data field |<br>';
                responseNotification.innerHTML = responseNotification.innerHTML + 'OPTIONAL QUERY ITEMS<br>| date range |';
            }else{
                responseNotification.innerHTML = 'Database Query Result';
            }
            speakQuery(currPeopleValid, queriedFieldValid);
            responseNotification.classList.add('response');
            terminal.scrollTop = terminal.scrollHeight;
            personHeard = false;
            recording = false;

            // console.log(start_date);
        }
        document.getElementById('status').innerText = 'Not Listening';
        document.getElementById('status').classList.remove('active');
    }
});


function speakQuery( currPeopleValid ,queriedFieldValid){
    // currPeopleList, queriedField
    if (!currPeopleValid && queriedFieldValid){
        var text = 'Please select a set of people.';
    }else if (currPeopleValid && !queriedFieldValid){
        var text = 'Please select a data field.';
    }else if (!currPeopleValid && !queriedFieldValid){
        var text = 'Please select a set of people and data field.';
    }else{
        speakText('valid query I will get some data');
    }
    speakText(text);
}

function speakText(text){
    let utterance = new SpeechSynthesisUtterance(text);
    // var synthesis = window.speechSynthesis;
    // var voices = speechSynthesis.getVoices();
    // console.log(voices);
    // utterance.voice = voices[6];
    // utterance.pitch = 1;
    // utterance.rate = 1;
    // utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
}


// KEEP TRACK IF USER ASKED FOR HELP
var askedForHelp = false;

function updateHelpCheck(results){
    /**
     * Keeps a running log of whether user asked for help.
     * Updated after each recognition result
     * @param {[SpeechRecognitionResultList]} results [current results]
     * @return {[null]} [updates the global variable queriedFields]
     */
    var res = results[0][0].transcript;
    res = res.toLowerCase();
    // console.log(res);
    if (res.includes('help') || res == 'help'){
        askedForHelp = true;
    }
}


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
    for (var i=0; i<dataFields.length; i++){
        if (res.includes(dataFields[i]) || res == dataFields[i]){
            queriedField = dataFields[i];
            let activeDoms = document.getElementsByClassName('field');
            for (var i=0; i<activeDoms.length; i++){
                activeDoms[i].classList.remove('selected');
            }  
            let domId = dataFields[i];
            document.getElementById(queriedField.replace(' ', '-')).classList.add('selected');
        }
    }
}

// function getFullQueryString(results){
//     /**
//      * Gets the string of the full query
//      * @param {[SpeechRecognitionResultList]} results [current results]
//      * @return {[string]} [the full query]
//      */
//     var res = '';
//     for (var i=0; i<results.length; i++){
//         var color = results[0][0].transcript;
//     }
// }


// KEEP TRACK OF SELECTED PEOPLE
// var people globably defined in template
var personHeard = false; // if a person is heard wipe the list, otherwise append
var currPeopleObjs = [];
var currPeopleList = [];

function updateSelectedPeople(results){
    /**
     * Keeps a running log of people currently selected.
     * Updated after each recognition result
     * @param {[SpeechRecognitionResultList]} results [current results]
     * @return {[null]} [updates the global variable queriedFields]
     */
    // -----------------------------------------------------------------------------------------check for duplicate names
    var res = results[0][0].transcript;
    res = res.toLowerCase();
    for (var i=0; i<people.length; i++){
        if (res.includes(people[i][0]) || res == people[i][0]){
            if (!personHeard){
                currPeopleList = [];
                currPeopleObjs = [];
                let activeDoms = document.getElementsByClassName('personContainer');
                for (var i=0; i<activeDoms.length; i++){
                    activeDoms[i].classList.remove('selected');
                }                
                personHeard = true;
            }
            // console.log(currPeopleList, people[i][0])
            if (!currPeopleList.includes(people[i][0])){
                currPeopleObjs.unshift(people[i]);
                currPeopleList.unshift(people[i][0]);
                let personDom = document.getElementById(people[i][0] + '0');
                personDom.classList.add('selected')
            }
        }
    }
}



// Bar chart
document.addEventListener('DOMContentLoaded', function(){
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
          labels: init_labels_date_range(NUM_DAYS),
          datasets: [{ 
              data: init_values_temp(NUM_DAYS),
              label: "Company Revenue",
              borderColor: "#1ec4a8",
              fill: false
            }
          ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
      });
});


function init_labels_date_range(num_days=120){
    // initialize last n days in list
    let totalsLabels = [];
    for (var i = 0; i < num_days; i ++){ 
        var d = new Date();
        d.setDate(d.getDate() - num_days + i);
        totalsLabels.push( d.toLocaleDateString());
    }
    return totalsLabels;
}

function init_values_temp(num_days=120){
    // initialize last n totals in list
    let totals = [];
    for (var i = 0; i < num_days; i ++){ 
        totals.push(i);
    }
    return totals
}


const   months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const   days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
const   digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var start_date = 'none';
var end_date   = 'none';
function updateDate(results){
    /**
     * Keeps a running log of most recent date.
     * Updated after each recognition result
     * @param {[SpeechRecognitionResultList]} results [current results]
     * @return {[null]} [updates the global variable queriedFields]
     */
    // ---------------------------------------------------------------------------------- check if out of range
    // ---------------------------------------------------------------------------------- fix date range
    let seenMatch=false;
    if(results[0].isFinal){
        var res = results[0][0].transcript;
        res = res.toLowerCase();
        console.log('res',res)
        for (var i=0; i<months.length; i++){
            for (var j=0; j<days.length; j++){
                var date_string = months[i] + ' ' + days[j];
                if (res.includes(date_string) || res == date_string){
                    console.log('included', date_string,res[res.indexOf(date_string) + date_string.length], digits.includes(res[res.indexOf(date_string) + date_string.length]))
                    if (!digits.includes(res[res.indexOf(date_string) + date_string.length])){
                        console.log(date_string)
                        if (start_date == 'none' || !seenMatch){
                            start_date = date_string;
                            end_date = 'none';
                            seenMatch = true;
                        }else{
                            end_date = date_string
                        }
                    }
                }
            }
       }
    }
}


function makeDateBar(){
    let bar = document.getElementById('dataBar');
    // left 40px, right 5px, NUM_DAYS total days
    // Create a date object for today
    const today = new Date();
    // Create a date object for NUM_DAYS days before today
    const firstDate = new Date(today.getTime() - (NUM_DAYS * 24 * 60 * 60 * 1000));

    // console.log(today-firstDate, parseInt((today - firstDate)/(24 * 60 * 60 * 1000)));

    const [selectedMonth, selectedDay] = start_date.split(' ');

    // Create a new date object for the current year
    const currentDate = new Date();

    // Set the year of the date object to the current year
    const year = currentDate.getFullYear();

    // Create a new date object for the specified month, day, and year
    const selectedDate = new Date(`${selectedMonth} ${selectedDay}, ${year}`);

    // If the resulting date is in the future, adjust it to the previous year
    if (selectedDate > currentDate) {
        selectedDate.setFullYear(year - 1);
    }
    const diffInMs_total = Math.abs(firstDate - today);
    const diffInDays_total = Math.ceil(diffInMs_total / (1000 * 60 * 60 * 24));
    const diffInMs_selected = Math.abs(firstDate - selectedDate);
    const diffInDays_selected = Math.ceil(diffInMs_selected / (1000 * 60 * 60 * 24));
    // var percentLeft = 100*parseInt((today - firstDate) * 24 * 60 * 60 * 1000)/NUM_DAYS;
    var percentLeft = 100*(diffInDays_selected - 1)/diffInDays_total;
    bar.style.left =  percentLeft + '%'; 
}

// DEBUG
// function moveBlock(){
//     let block = document.getElementById('block');
//     console.log(mousePos);
//     console.log(gazePos);
//     block.style.left = gazePos.x + 'px';
//     block.style.top = gazePos.y + 'px';
// }