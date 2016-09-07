var request = function(method, url, callback){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      callback(data);
    }
  }
  xmlhttp.open(method, url, true);
  xmlhttp.send();
}

exports.get = request.bind(undefined, 'GET');
exports.post = request.bind(undefined, 'POST');
