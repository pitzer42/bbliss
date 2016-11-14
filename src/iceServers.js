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
  "certificates": [{}]
}
/*
'stun:stun01.sipphone.com',
'stun:stun.ekiga.net',
'stun:stunserver.org',
'stun:stun4.l.google.com:19302',
'stun:stun3.l.google.com:19302',
'stun:stun2.l.google.com:19302',
'stun:stun1.l.google.com:19302'
*/
