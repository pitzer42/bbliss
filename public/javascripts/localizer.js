var request = function(method, url, callback){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      callback(data);
    }
  };
  xmlhttp.open(method, url, true);
  xmlhttp.send();
};

request('GET', 'http://ipinfo.io/json', (data)=>{
  document.write(data.loc);
});
