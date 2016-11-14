module.exports ={
  "iceServers": [{
    "urls": "stun:turn02.uswest.xirsys.com"
  }, {
    "username": "ff0f23a8-aa79-11e6-93e0-f7cc27a399ea",
    "urls": "turn:turn02.uswest.xirsys.com:80?transport=udp",
    "credential": "ff0f247a-aa79-11e6-8942-375dc0dce312"
  }, {
    "username": "ff0f23a8-aa79-11e6-93e0-f7cc27a399ea",
    "urls": "turn:turn02.uswest.xirsys.com:3478?transport=udp",
    "credential": "ff0f247a-aa79-11e6-8942-375dc0dce312"
  }, {
    "username": "ff0f23a8-aa79-11e6-93e0-f7cc27a399ea",
    "urls": "turn:turn02.uswest.xirsys.com:80?transport=tcp",
    "credential": "ff0f247a-aa79-11e6-8942-375dc0dce312"
  }, {
    "username": "ff0f23a8-aa79-11e6-93e0-f7cc27a399ea",
    "urls": "turn:turn02.uswest.xirsys.com:3478?transport=tcp",
    "credential": "ff0f247a-aa79-11e6-8942-375dc0dce312"
  }, {
    "username": "ff0f23a8-aa79-11e6-93e0-f7cc27a399ea",
    "urls": "turns:turn02.uswest.xirsys.com:443?transport=tcp",
    "credential": "ff0f247a-aa79-11e6-8942-375dc0dce312"
  }, {
    "username": "ff0f23a8-aa79-11e6-93e0-f7cc27a399ea",
    "urls": "turns:turn02.uswest.xirsys.com:5349?transport=tcp",
    "credential": "ff0f247a-aa79-11e6-8942-375dc0dce312"
  }]
}
/*

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
*/

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
