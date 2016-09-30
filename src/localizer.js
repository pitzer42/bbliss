function geolocationAPI(onLocalized){
  const $ = require('jquery')
  const api_url = 'http://ipinfo.io/json'
  const onResponse = (response)=>{onLocalized(response.loc)}
  $.get(api_url, onResponse)
}

function parseLocation(position){
  return position.coords.latitude + ',' + position.coords.longitude
}

module.exports = function(onLocalized){
  //onLocalized({loc:'0,0'})
  ///*
  const fallback = ()=>{
    geolocationAPI(onLocalized);
  }
  const html5Geolocation = position=>{
    onLocalized(parseLocation(position))
  }
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(html5Geolocation, fallback)
  }else
  fallback()
  //*/
};
