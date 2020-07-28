//code based on https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas

var processor = {
    timerCallback: function() {
      if (this.video.paused || this.video.ended) {
        return;
      }
      this.computeFrame();
      var self = this;
      setTimeout(function () {
          self.timerCallback();
        }, 0);
    },
  
    doLoad: function() {
      //for now it's only manipulating the local-video but 
      //the idea is that this will be applied to mini-video and remote-video 
      //with how many seconds delay communicating via socket.io
      this.video = document.getElementById("local-video");
      // this.video.style.display = "none";
      this.c1 = document.createElement("canvas");
      //give the id "c1" below css rule was added in the css file 
      //for the canvas to overlap with the main video but not disable the interactivity
      /*#c1 {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        max-height: 100%;
        max-width: 100%;
        object-fit: cover;
        -moz-transform: scale(-1, 1);
        -ms-transform: scale(-1, 1);
        -o-transform: scale(-1, 1);
        -webkit-transform: scale(-1, 1);
        transform: scale(-1, 1);
        transition: opacity 1s;
        width: 100%;
      }*/
      this.c1.setAttribute("id","c1");
      document.body.append(this.c1);
      this.ctx1 = this.c1.getContext("2d");
      this.frames = [];
      // this.c2 = document.getElementById("c2");
      // this.ctx2 = this.c2.getContext("2d");
      var self = this;
      this.video.addEventListener("play", function() {

          self.width = self.video.videoWidth;
          self.height = self.video.videoHeight;
          
          self.c1.width = self.video.videoWidth;
          self.c1.height = self.video.videoHeight;
          self.c1.style.pointerEvents = "none";

          self.timerCallback();
        }, false);
    },
  
    computeFrame: function() {
      //draw the current video frame onto the canvas 1 
      this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
      // create a temporary canvas to hold the overlay
      // this canvas is not part of DOM
      var canvas2=document.createElement("canvas");
      canvas2.width=this.width;
      canvas2.height=this.height
      var ctx2 = canvas2.getContext("2d");
      //get the image data from the canvas 1.
      var frame = this.ctx1.getImageData(0, 0, this.width, this.height);

      var l = frame.data.length / 4;
  
      for (var i = 0; i < l; i++) {
        //set the alpha channel to 50%
        frame.data[i * 4 + 3] = 127;
      }

      //save the current frame to frames array
      //it saves 2 seconds
      if(this.frames.length < 120) {
        this.frames.push(frame);
      } else {
        this.frames.shift();
        this.frames.push(frame);
      }

      //after the some time 5secs or so, draw the delayed frames over the canvas 1
      if(this.frames.length == 300) {
        //load the canvas2 with the image data saved in the array
        ctx2.putImageData(this.frames[0], 0, 0);
        //draw the canvas2 to canvas1. 
        //use drawImage rather than putImageData which will override everything
        this.ctx1.drawImage(canvas2,0,0);
      }
      
      return;
    }
  };

document.addEventListener("DOMContentLoaded", function() {
  processor.doLoad();
});