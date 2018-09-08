

    var playerInstance = function(url) {


        var state = $.Deferred();
        var sourceURL = url;

        //var sourceURL = url;
        var mediaFormat = undefined;
        var mediaFormats = [
            {
                extension: '.mp4',
                mimeType: 'video/mp4',
                provider: [],
                seekable: false
            },
            {
                extension: '.mpd',
                mimeType: 'application/dash+xml',
                provider: ['/scripts/dash.mediaplayer.min.js', '/scripts/videojs-dash.min.js'],
                seekable: false
            },
            {
                extension: '.m3u8',
                mimeType: 'application/x-mpegURL',
                provider: [], //'/scripts/videojs-contrib-hls.js', '/scripts/videojs-dvrseekbar.min.js'
                seekable: true
            }
        ];

        function importScript(scripts) {
            var items = scripts.map(function (url) { return $.getScript(url) });
            return $.when.apply($, items).done(function () { Array.prototype.forEach.call(arguments, function (res) { eval.call(this, res[0]); }); });
        }
        function setMediaFormat(sourceURL) {

            for (var i = 0; i < mediaFormats.length; i++)
            {
                var extension = mediaFormats[i].extension;
                if (sourceURL.indexOf(extension) > 0)
                {
                    mediaFormat = mediaFormats[i];
                    importScript(mediaFormat.provider).done(function () { state.resolve(); });
                    break;
                }
            }
        }

        //sourceURL = window.location.search.substr(5);
        setMediaFormat(sourceURL);
        $.when(state).done(function () { videojs("player", {}, function () { this.src({ src: sourceURL, type: mediaFormat.mimeType }).play(); }).qualityPickerPlugin(); });

    };