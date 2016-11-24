module.exports = {
	"rtcpMuxPolicy": "require",
	"bundlePolicy": "max-bundle",
	"iceServers": [{
		"urls": ["stun:stun.l.google.com:19302"]
	}],
	"certificates": [{}]
}
/*
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
*/

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
'stun:stun01.sipphone.com',
'stun:stun.ekiga.net',
'stun:stunserver.org',
'stun:stun4.l.google.com:19302',
'stun:stun3.l.google.com:19302',
'stun:stun2.l.google.com:19302',
'stun:stun1.l.google.com:19302'
*/
