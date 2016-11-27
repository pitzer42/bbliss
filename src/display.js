function setStream(stream){
  console.log('Display ' + stream)
  const streamURL = window.URL.createObjectURL(stream)
  const video = document.querySelector('video')
  video.src = streamURL
}

module.exports = setStream
