const audio = new Audio("http://www.foxysite.de/StarWars/HAN02.WAV");
document.addEventListener('DOMContentLoaded', initGazefilter());
    let trackingData = false;
    async function initGazefilter(){
        let WASM_URL = '/static/gazefilter.wasm';
        await gazefilter.init(WASM_URL);
        try{
            var calibs = window.localStorage.getItem('calibrations');
            await gazefilter.tracker.setCalibration(JSON.parse(calibs));

        }catch{
            console.log('loading error')
        }
        await gazefilter.tracker.connect(); 
        let canvas = document.getElementById("tracker-canvas");
        gazefilter.visualizer.setCanvas(canvas);
        gazefilter.visualizer.setListener("filter", render);
        
        document.addEventListener("mousemove", startWeights);

        function startWeights(event){
            gazefilter.tracker.calibrate(
                event.timeStamp,  // relative to performance.timeOrigin
                event.screenX,  // in pixels
                event.screenY,  // in pixels
                1.0  // see note below
            ); 
            document.removeEventListener("mousemove", startWeights)
        }

        function oncalib(response) {
            console.log("calibration error: ", response.errorValue);
        }

        gazefilter.tracker.addListener("calib", oncalib);

        gazefilter.tracker.addListener("filter", event => {
            if (!isNaN(event.bestGazePoint()[0])){
                // console.log(event.bestGazePoint())
                var[x,y] = event.bestGazePoint();
                var dot = document.getElementById('dot');
                dot.style.left = x + 'px';
                dot.style.top  = y + 'px';
                if (!trackingData){
                    canvasBox.classList.add('ready');
                    trackingData = true
                }
            }else{
                if (trackingData){
                    canvasBox.classList.remove('ready');
                    trackingData = false
                }
            }
        });

        const target = document.querySelector('.target');

        target.addEventListener('click', function(event) {
                audio.play();
                gazefilter.tracker.calibrate(
                    event.timeStamp,  // relative to performance.timeOrigin
                    event.screenX,  // in pixels
                    event.screenY,  // in pixels
                    1.0  // see note below
                );
                try{
                    var myObject =  gazefilter.tracker.getCalibration();
                    var calibs = new Object;
                    calibs.count = myObject.count;
                    calibs.data = Array.from(myObject.data); // bug fix
                    calibs.device = myObject.device;
                    calibs.error = myObject.error;
                    calibs.eye = myObject.eye;
                    calibs.timestamp = myObject.timestamp;
                    calibs.version = myObject.version;
                    window.localStorage.setItem('calibrations', JSON.stringify(calibs));
                }catch{}
                transportTarget(target);
        });

    }

    function transportTarget(target){
        const x = Math.floor(Math.random() * (window.innerWidth - 50));
        const y = Math.floor(Math.random() * (window.innerHeight-50));
        target.style.left = x + 'px';
        target.style.top = y + 'px';
    }

    function render(ctx, trackEvent) {
        console.log('drW')
        // draw video frame
        ctx.drawImage(
            gazefilter.tracker.videoElement(),
            0, 0, ctx.canvas.width, ctx.canvas.height
        );

        // set drawing style
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'white';
        ctx.lineWidth = 2;

        // draw facial landmarks
        let shapeArray = trackEvent.shapeArrayView();
        for (let i = 0; i < trackEvent.shapeSize(); i++) {
            ctx.beginPath();
            let pointX = shapeArray[i * 2];
            let pointY = shapeArray[i * 2 + 1];
            ctx.arc(pointX, pointY, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // draw pupil center points
        ctx.strokeStyle = 'red';
        let [lx, ly, rx, ry] = trackEvent.pupilArray();
        ctx.beginPath();
        ctx.arc(lx, ly, 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rx, ry, 3, 0, Math.PI * 2);
        ctx.stroke();
}


document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
      var laser = document.createElement('div');
      laser.classList.add('laser');
      laser.style.left = (event.clientX - 10) + 'px';
      laser.style.top = (event.clientY - 10) + 'px';
      document.body.appendChild(laser);

      setTimeout(function() {
        document.body.removeChild(laser);
      }, 1000);
    });
  });