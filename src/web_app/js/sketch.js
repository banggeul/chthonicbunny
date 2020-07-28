//See https://p5js.org/examples/ for more examples
// and https://p5js.org/reference/ for reference
var socket
var curColor = 'rgb(255, 255, 255)';
var strokeWidth = 4;
var widthScale = 4
var heightScale = 4
var thisURL
var osc, playing, freq, amp;

function preload() {
}

function setup() {
  //socketio
  socket = io.connect('https://chthonicbunny.dev:80');
  socket.on('mouse', function(data) {
		stroke(color(data.color));
		strokeWeight(data.strokeWidth);
		line(data.x, data.y, data.px, data.py);
    return;
	});


  var canvas = createCanvas(windowWidth/widthScale, windowHeight/heightScale);
  canvas.parent('sketch-div');
  thisURL = getURL();
  frameRate(30);

  textSize(24);
  textAlign(CENTER, CENTER);

  canvas.mousePressed(playOscillator);
  osc = new p5.Oscillator('sine');
  osc2 = new p5.Oscillator('sine');
  osc3 = new p5.Oscillator('sine');

  background(0,0,0);

}

function draw() {

  freq = constrain(map(mouseX, 0, width, 100, 880), 100, 880);
  amp = constrain(map(mouseY, height, 0, 0, 1), 0, 1);

  // if (mouseIsPressed) {
  //   text(thisURL, mouseX, mouseY);
  // } else {
  //   text("Press r, g, or b", mouseX, mouseY);
  // }

  if (playing) {
    // smooth the transitions by 0.1 seconds
    osc.freq(freq, 0.1);
    osc.amp(amp, 0.1);
    osc2.freq(freq*0.3333, 0.1);
    osc2.amp(amp, 0.1);
    osc3.freq(freq*1.5, 0.1);
    osc3.amp(amp, 0.1);
  }

}

function playOscillator() {
  // starting an oscillator on a user gesture will enable audio
  // in browsers that have a strict autoplay policy.
  // See also: userStartAudio();
  osc.start();
  osc2.start();
  osc3.start();
  playing = true;
}

function windowResized() {
  resizeCanvas(windowWidth/widthScale, windowHeight/heightScale);
}

function mouseReleased() {
  // ramp amplitude to 0 over 0.5 seconds
  osc.amp(0, 0.5);
  osc2.amp(0, 0.5);
  osc3.amp(0, 0.5);
  playing = false;
  clear();
}

function touchStarted() {
}

function touchMoved() {
}

function touchEnded(){
}

function keyTyped() {
  if (key === 'r') {
    background(255,0,0);
  } else if (key === 'b') {
    background(0,0,255);
  } else if (key === 'g') {
    background(0,255,0);
  }
  // uncomment to prevent any default behavior
  // return false;
}

function mouseDragged() {
	// Draw
	stroke(color(curColor));
	strokeWeight(strokeWidth);
	line(mouseX, mouseY, pmouseX, pmouseY);

	// Send the mouse coordinates
	sendmouse(mouseX, mouseY, pmouseX, pmouseY);
}

// Sending data to the socket
function sendmouse(x, y, pX, pY) {
	var data = {
		x: x,
		y: y,
		px: pX,
		py: pY,
		color: curColor,
		strokeWidth: strokeWidth,
	}

	socket.emit('mouse', data)
}
