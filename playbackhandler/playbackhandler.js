var processes = {};
const FIFO = require('fifo-js')
let et_fifo = new FIFO('/tmp/et_fifo')

function play(url, callback) {
	
	console.log('Play URL : ' + url);
	var process = require('child_process');
	let et_fifo = new FIFO('/tmp/et_fifo')
    et_fifo.write('play')

    var command = "/usr/bin/mplayer";	
    var arguments = [
        url, 
        '-fs', 
        '-fstype', '-none', 
        '-zoom', 
        '-slave', 
        '-input', 'file=/tmp/et_fifo',
        '-input', 'nodefault-bindings',
        '-noconfig', 'all'
        ]	
	// Start playback
    process.execFile(command, arguments, {}, function (error, stdout, stderr) {
		if (error) {
			console.log('Process closed with error: ' + error);
		}
	});
}

function stop(callback) { 
    et_fifo.write('stop')
}

function pause() {
    et_fifo.write('pause')
}

function pause_toggle() {
    et_fifo.write('pause')
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
