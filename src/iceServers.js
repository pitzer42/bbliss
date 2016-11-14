
var iceServers = [];

iceServers.push({
    url: 'stun:stun.l.google.com:19302'
});

iceServers.push({
    url: 'stun:stun.anyfirewall.com:3478'
});

iceServers.push({
    url: 'turn:turn.bistri.com:80',
    credential: 'homeo',
    username: 'homeo'
});

iceServers.push({
    url: 'turn:turn.anyfirewall.com:443?transport=tcp',
    credential: 'webrtc',
    username: 'webrtc'
});

module.exports = {
    iceServers: iceServers,
    iceTransports: 'all'
};

/*
module.exports = {
  "rtcpMuxPolicy": "require",
  "bundlePolicy": "max-bundle",
  "iceServers": [{
    "urls": ["turn:74.125.134.127:19305?transport=udp", "turn:[2607:F8B0:400C:C00::7F]:19305?transport=udp", "turn:74.125.134.127:443?transport=tcp", "turn:[2607:F8B0:400C:C00::7F]:443?transport=tcp"],
    "username": "CMCmrMEFEgatrPmq4N4Yzc/s6OMT",
    "credential": "mNoNrLjcYi5Lf4rHxeqiCf+/hvw="
  }, {
    "urls": ["stun:stun.l.google.com:19302"]
  }],
  "iceTransports": "all"
}
*/

/*
'stun:stun01.sipphone.com',
'stun:stun.ekiga.net',
'stun:stunserver.org',
'stun:stun4.l.google.com:19302',
'stun:stun3.l.google.com:19302',
'stun:stun2.l.google.com:19302',
'stun:stun1.l.google.com:19302'
*/
