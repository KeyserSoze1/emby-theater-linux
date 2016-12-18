define(['apphost', 'pluginManager', 'events', 'embyRouter'], function (appHost, pluginManager, events, embyRouter) {
    'use strict';

    return function () {

        var self = this;
		
		//alert("Plugin Loaded");

        self.name = 'Linux Media Player';
        self.type = 'mediaplayer';
        self.id = 'linuxmediaplayer';
        self.requiresVideoTransparency = true;

        var currentSrc;
        var playerState = {};
        var ignoreEnded;

        self.canPlayMediaType = function (mediaType) {
			//alert("canPlayMediaType");
			
			return true;
        };

        self.canPlayItem = function (item) {
			//alert("canPlayItem");

            return true;
        };

        self.getDeviceProfile = function () {
			//alert("getDeviceProfile");
			
            var profile = {};

            profile.MaxStreamingBitrate = 100000000;
            profile.MaxStaticBitrate = 100000000;
            profile.MusicStreamingTranscodingBitrate = 192000;

            profile.DirectPlayProfiles = [];

            profile.DirectPlayProfiles.push({
                Container: 'm4v,3gp,ts,mpegts,mov,xvid,vob,mkv,wmv,asf,ogm,ogv,m2v,avi,mpg,mpeg,mp4,webm,wtv,dvr-ms,iso,m2ts',
                Type: 'Video'
            });

            profile.DirectPlayProfiles.push({
                Container: 'aac,mp3,mpa,wav,wma,mp2,ogg,oga,webma,ape,opus,flac',
                Type: 'Audio'
            });

            profile.TranscodingProfiles = [];

            profile.TranscodingProfiles.push({
                Container: 'mkv',
                Type: 'Video',
                AudioCodec: 'mp3,ac3,aac',
                VideoCodec: 'h264',
                Context: 'Streaming'
            });

            profile.TranscodingProfiles.push({
                Container: 'mp3',
                Type: 'Audio',
                AudioCodec: 'mp3',
                Context: 'Streaming',
                Protocol: 'http'
            });

            profile.ContainerProfiles = [];

            profile.CodecProfiles = [];

            // Subtitle profiles
            // External vtt or burn in
            profile.SubtitleProfiles = [];
            profile.SubtitleProfiles.push({
                Format: 'srt',
                Method: 'External'
            });
            profile.SubtitleProfiles.push({
                Format: 'ass',
                Method: 'External'
            });
            profile.SubtitleProfiles.push({
                Format: 'ssa',
                Method: 'External'
            });
            profile.SubtitleProfiles.push({
                Format: 'srt',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'subrip',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'ass',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'ssa',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'pgs',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'pgssub',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'dvdsub',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'dvbsub',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'vtt',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'sub',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'idx',
                Method: 'Embed'
            });
            profile.SubtitleProfiles.push({
                Format: 'smi',
                Method: 'Embed'
            });

            profile.ResponseProfiles = [];

            return Promise.resolve(profile);
        };

        self.currentSrc = function () {
			//alert("currentSrc");
            return currentSrc;
        };

        self.play = function (options) {
			
            var mediaSource = JSON.parse(JSON.stringify(options.mediaSource));

            var url = options.url;

            ignoreEnded = false;
            currentSrc = url;

            var isVideo = options.item.MediaType == 'Video';
   
			sendData("play", url, setCurrentPos);

			            embyRouter.showVideoOsd(); 
                        //embyRouter.setTransparency('none');
                        //embyRouter.setTransparency('backdrop');

            return Promise.resolve();
        };

        // Save this for when playback stops, because querying the time at that point might return 0
        self.currentTime = function (val) {
			//alert("currentTime");
			
            if (val != null) {
                // set current time
                return;
            }

            return 0;
        };

        self.duration = function (val) {
			//alert("duration");
            return 0;
        };

        self.stop = function (destroyPlayer, reportEnded) {
			currentSrc = "";
            sendData("stop");	
            events.trigger(self, 'stopped');
			embyRouter.setTransparency('none');			
        };

        self.destroy = function () {
			//alert("destroy");
			embyRouter.setTransparency('none');
        };

        self.pause = function () {
			sendData("pause_toggle")
        };

        self.unpause = function () {
			sendData("pause_toggle")
        };

        self.paused = function () {
			//alert("paused");
			//sendData("pause_toggle")			
            return false;
        };

        self.volume = function (val) {
			//alert("volume");
            if (val != null) {
                // set vol
                return;
            }

            return 0;
        };

        self.setSubtitleStreamIndex = function (index) {
        };

        self.setAudioStreamIndex = function (index) {
        };

        self.canSetAudioStreamIndex = function () {
            return true;
        };

        self.setMute = function (mute) {
        };

        self.isMuted = function () {
            return false;
        };
		
		function setCurrentPos(data) {
			console.log(data);
		}

		function sendData(action, sendData, callback) {
			
			sendData = encodeURIComponent(sendData);
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'linuxplayer://' + action + '?data=' + sendData, true);
			xhr.onload = function () {
				if (this.response) {
					var data = this.response;
					if(callback) {
						callback(data);
					}
				}
			};
			xhr.send();
		}
		
    }
});
