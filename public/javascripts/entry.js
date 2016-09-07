window.onAddStreamClick = function(){
  const title = document.getElementById('title').value;
  const localizer = require('./localizer');
  localizer.locate((location)=>{
    const profile = JSON.stringify({
      title: title,
      location: location,
      browser: navigator.userAgent
    });
    document.location = '/stream?profile='+profile;
  });
}
