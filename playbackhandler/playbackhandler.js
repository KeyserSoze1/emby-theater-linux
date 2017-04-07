var processes = {};
var timeposition
var mainWindowRef
var mpvPlayer

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

function get_position(callback) {
	callback(timeposition);
}

function set_position(data) {
	mpvPlayer.goToPosition(data / 1000000000)
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
        case 'get_position':
        	get_position(callback);
        	//console.log("Get position called, timeposition = " + String(timeposition));
        	break;
        case 'set_position':
        	var data = url_parts.query["data"];
        	set_position(data);
        	callback("Set Position Action");
        	//console.log("Set position called, request = " + String(data));
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

function initialize(playerWindow) {
        var Long = require("long");
	// this is Linux / little endian architecture specific
        var longVal = Long.fromString(playerWindow.getNativeWindowHandle().swap64().toString('hex'), unsigned=true, radix=16);
        console.log('PlayerWindowId : ' + longVal.toString());
        var mpv=require('node-mpv');
        mpvPlayer = new mpv({
            "ipc_command" : "--input-unix-socket",
            "socket" : "/tmp/emby.sock",
            "debug" : true
            },
            [
             "--wid=" + longVal.toString(),
             "--no-osc"
            ]);	
	mpvPlayer.on('timeposition', function (data) {
	    timeposition = data * 1000000000;
	});

	mpvPlayer.on('started', function () {
	    mainWindowRef.focus();
	});
}

function registerMediaPlayerProtocol(protocol, mainWindow) {

	protocol.registerStringProtocol('linuxplayer', function (request, callback) {
		processRequest(request, callback);
		mainWindowRef=mainWindow;
	});
	
}

exports.initialize = initialize;
exports.registerMediaPlayerProtocol = registerMediaPlayerProtocol;
