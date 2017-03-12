﻿define([], function () {
    'use strict';

    function getCapabilities() {

        var caps = {
            PlayableMediaTypes: ['Audio', 'Video'],

            SupportsPersistentIdentifier: true
        };

        return Promise.resolve(caps);
    }

    function getWindowState() {
        return document.windowState || 'Normal';
    }

    function setWindowState(state) {

        // Normal
        // Minimized
        // Maximized

        sendCommand('windowstate-' + state);
    }

    function sendCommand(name) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'electronapphost://' + name, true);

        xhr.send();
    }

    function supportsVoiceInput() {
        return window.SpeechRecognition ||
               window.webkitSpeechRecognition ||
               window.mozSpeechRecognition ||
               window.oSpeechRecognition ||
               window.msSpeechRecognition;
    }

    var supportedFeatures = function () {

        var features = [
            'windowstate',
            'exit',
            'runatstartup',
            'filedownload',
            'sharing',
            'externallinks',
            'sleep',
            //'restart',
            'shutdown'
        ];

        if (appStartInfo.supportsTransparentWindow) {
            features.push('windowtransparency');
        }

        if (supportsVoiceInput()) {
            features.push('voiceinput');
        }

        if (self.ServiceWorkerSyncRegistered) {
            //features.push('sync');
        }

        features.push('connectsignup');

        features.push('soundeffects');
        features.push('displaymode');
        features.push('plugins');
        features.push('exitmenu');
        features.push('htmlaudioautoplay');
        features.push('htmlvideoautoplay');
        features.push('fullscreenchange');
        //features.push('displayableversion');

        //features.push('remotecontrol');

        features.push('multiserver');
        features.push('imageanalysis');
        features.push('remotemedia');

        return features;
    }();

    return {
        getWindowState: getWindowState,
        setWindowState: setWindowState,
        supports: function (command) {

            return supportedFeatures.indexOf(command.toLowerCase()) !== -1;
        },
        capabilities: function () {
            return {
                PlayableMediaTypes: ['Audio', 'Video'],

                SupportsPersistentIdentifier: true
            };
        },
        getCapabilities: getCapabilities,
        exit: function () {
            sendCommand('exit');
        },
        sleep: function () {
            sendCommand('sleep');
        },
        restart: function () {
            sendCommand('restart');
        },
        shutdown: function () {
            sendCommand('shutdown');
        },
        appInfo: function () {

            return Promise.resolve({
                appName: appStartInfo.name,
                appVersion: appStartInfo.version,
                deviceName: appStartInfo.deviceName,
                deviceId: appStartInfo.deviceId
            });
        },
        appName: function () {
            return appStartInfo.name;
        },
        appVersion: function () {
            return appStartInfo.version;
        },
        deviceName: function () {
            return appStartInfo.deviceName;
        },
        deviceId: function () {
            return Promise.resolve(appStartInfo.deviceId);
        },

        moreIcon: 'dots-vert',

        getKeyOptions: function () {

            return {

                // chromium doesn't automatically handle these
                handleAltLeftBack: true,
                handleAltRightForward: true,
                keyMaps: {
                    back: [
                        8,
                        // ESC
                        27
                    ]
                }
            };

        }
    };
});