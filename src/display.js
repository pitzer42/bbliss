function setStream(stream){
  const video = document.querySelector('video')
  video.srcObject = stream
  window.stream = stream
}

module.exports = setStream
