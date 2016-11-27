function setStream(stream){
  const video = document.querySelector('video')
  video.srcObject = stream
}

module.exports = setStream
