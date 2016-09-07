function GeolocationAPI(onLocalized){
  const request = require('./request');
  const api_url = 'http://ipinfo.io/json';
  const onResponse = (response)=>{ onLocalized(response.loc); };
  request.get(api_url, onResponse);
}

exports.locate = function(onLocalized){
  const fallback = ()=>{
    GeolocationAPI(onLocalized);
  };
  if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(onLocalized, fallback);
  else
    fallback();
};
