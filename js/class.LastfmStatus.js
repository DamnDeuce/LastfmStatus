(function() {
    function switchMethod(args, methods) {
        var methodOrOptions = args[0];
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, args.slice(1));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.ctor.apply( this, args );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.' + methods.getName());
        }
    }

    $.fn.jsLastfmStatus = function(methodOrOptions) {
        var args = Array.prototype.slice.call(arguments);
        return this.each(function() {
            var _this = this;
            var options = {
                user: "DamnDeuce",
                period: 3000,
                autoStart: true,
                showLastPlayed: true
            };
            var methods = {
                getName: function() {
                    return 'jsLastfmStatus';
                },
                ctor: function (params) {
                    _this.$wrap = $(_this);
                    options = $.extend(options, params);

                    _this.apiKey = "1ed01c0b7263a47fb2ad580870b3970c";
                    _this.$track = _this.$wrap.find(".current-track");
                    _this.$userLink = _this.$wrap.find(".user-link");
                    _this.active = false;
                    _this.visible = false;

                    methods.setUser(options.user);

                    _this.$wrap.on("refresh", function (event, state) {
                        if (state) {
                            methods.start();
                        } else {
                            methods.stop();
                        }
                    });

                    if (options.autoStart) {
                        methods.start();
                    }
                },
                setUser: function(name) {
                    _this.recentTrackUrl = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user="
                        + name + "&api_key=" + _this.apiKey + "&limit=1&format=json";
                    _this.$userLink.attr("href", "http://www.last.fm/ru/user/" + options.user);
                },
                show: function() {
                    _this.visible = true;
                    _this.$wrap.fadeIn();
                },
                hide: function() {
                    _this.visible = false;
                    _this.$wrap.fadeOut();
                },
                refresh: function() {
                    $.ajax({
                        url: _this.recentTrackUrl,
                        success: function (data) {
                            if (data.error) {
                                console.error(data.error.message);
                                methods.hide();
                                return;
                            }
                            var rt = data.recenttracks;
                            var track = Array.isArray(rt.track) ? rt.track[0] : rt.track;
                            if ((track["@attr"] && (track["@attr"].nowplaying === "true"))
                                || options.showLastPlayed) {
                                if (!_this.visible) {
                                    methods.show();
                                }
                                _this.$track.text(track.artist["#text"] + " — " + track.name);
                                var href = track.url || 'javascript:void(0)';
                                href = href.replace(/https/, 'http');
                                _this.$track.attr('href', href);
                            } else {
                                methods.hide();
                            }
                        }
                    })
                },
                start: function () {
                    _this.active = true;
                    methods.refresh();
                    _this.refreshHandler = setInterval(function () {
                        methods.refresh();
                    }, options.period);
                },
                stop: function () {
                    _this.active = false;
                    methods.hide();
                    clearInterval(_this.refreshHandler);
                }
            };
            switchMethod(args, methods);
        });
    };
})();