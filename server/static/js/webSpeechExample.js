var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];

var recognition = new SpeechRecognition();
if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  var speechRecognitionList = new SpeechGrammarList();
  var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


window.onload = function () {
    var diagnostic = document.querySelector('.output');
    var bg = document.querySelector('html');
    var hints = document.querySelector('.hints');

    var colorHTML= '';
    colors.forEach(function(v, i, a){
    console.log(v, i);
    colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
    });
    hints.innerHTML = 'Tap/click then say a color to change the background color of the app. Try ' + colorHTML + '.';

    document.body.onclick = function() {
        recognition.start();
        console.log('Ready to receive a color command.');
      }
      
      recognition.onresult = function(event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at the last position.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object
        var color = event.results[0][0].transcript;
        diagnostic.textContent = 'Result received: ' + color + '.';
        bg.style.backgroundColor = color;
        console.log('Confidence: ' + event.results[0][0].confidence);
      }
      
      recognition.onspeechend = function() {
        recognition.stop();
      }
      
      recognition.onnomatch = function(event) {
        diagnostic.textContent = "I didn't recognise that color.";
      }
      
      recognition.onerror = function(event) {
        diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
      }
};

function getLocalStream() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        window.localStream = stream; // A
        window.localAudio.srcObject = stream; // B
        window.localAudio.autoplay = true; // C
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
  }


/////////////////////////////////////////////////////////////



// const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
// const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
// const SpeechRecognitionEvent =
//   window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

// const colors = [
//     "aqua",
//     "azure",
//     "beige",
//     "bisque",
//     "black",
//     "blue",
//     "brown",
//     "chocolate",
//     "coral" /* … */,
// ];

// // format JSGF grammar
// const grammar = `#JSGF V1.0; grammar colors; public <color> = ${colors.join(
//     " | "
// )};`;

// window.onload = function () {
//     // initialize speech recognition
//     const recognition = new SpeechRecognition();
//     const speechRecognitionList = new SpeechGrammarList();
//     speechRecognitionList.addFromString(grammar, 1);
//     recognition.grammars = speechRecognitionList;
//     recognition.continuous = false;
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     // start speech recognition
//     const diagnostic = document.querySelector(".output");
//     const bg = document.querySelector("html");
//     const hints = document.getElementById("hints");

//     let colorHTML = "";
//     colors.forEach((color, i) => {
//         console.log(color, i);
//         colorHTML += `<span style="background-color:${color};"> ${color} </span>`;
//     });
//     hints.innerHTML = `Tap or click then say a color to change the background color of the app. Try ${colorHTML}.`;

//     document.body.onclick = () => {
//         alert('click');
//         recognition.start();
//         console.log("Ready to receive a color command.");
//     };

//     // recieve and handle result
//     recognition.onresult = (event) => {
//         const color = event.results[0][0].transcript;
//         diagnostic.textContent = `Result received: ${color}.`;
//         bg.style.backgroundColor = color;
//         console.log(`Confidence: ${event.results[0][0].confidence}`);
//     };

//     recognition.onspeechend = () => {
//         recognition.stop();
//     };

//     recognition.onnomatch = (event) => {
//         diagnostic.textContent = "I didn't recognize that color.";
//     };

//     recognition.onerror = (event) => {
//         diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
//     };
// };

