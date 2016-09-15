'use strict';

require('webrtc-adapter')

const constraints = {
  audio: false,
  video: true
};

function displayVideo(stream) {
  const video = document.querySelector('video');
  window.stream = stream; // stream available to console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
}

function logError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, displayVideo, logError);
