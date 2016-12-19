var processes = {};
var mpv=require('node-mpv');
mpvPlayer = new mpv({
            "ipc_command" : "--input-unix-socket",
            "socket" : "/tmp/emby.sock",
            "debug" : true
            },
            [
             "--fullscreen",
             "--no-osc"
            ]);	

function play(url, callback) {
	console.log('Play URL : ' + url);
    mpvPlayer.loadFile(url);
}

function stop(callback) { 
    mpvPlayer.stop();
}

function pause() {
    mpvPlayer.pause();
}

function pause_toggle() {
    mpvPlayer.togglePause();
}

function processRequest(request, callback) {

	var url = require('url');
	var url_parts = url.parse(request.url, true);
	var action = url_parts.host;

	switch (action) {

		case 'play':
			var data = url_parts.query["data"];			
			play(data, callback);
			callback("Play Action");
			break;
        case 'stop':			
            stop(callback);
            callback("Stop Action");
            break;
        case 'pause_toggle':
            pause_toggle();
            break;             
        case 'pause':
            pause();
            break; 			
		default:
			console.log('playbackhandler:processRequest action unknown : ' + action);
			callback("");
			break;
	}
}

function registerMediaPlayerProtocol(protocol) {

	protocol.registerStringProtocol('linuxplayer', function (request, callback) {
		processRequest(request, callback);
	});
	
}

exports.registerMediaPlayerProtocol = registerMediaPlayerProtocol;
