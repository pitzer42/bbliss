function GeolocationAPI(onLocalized){
  const $ = require('jquery');
  const api_url = 'http://ipinfo.io/json';
  const onResponse = (response)=>{onLocalized(response.loc)}
  //onResponse({loc:"here"})
  $.get(api_url, onResponse);
}

module.exports = function(onLocalized){
  const fallback = ()=>{
    GeolocationAPI(onLocalized);
  };
  if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(onLocalized, fallback);
  else
    fallback();
};
