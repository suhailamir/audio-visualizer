"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Work In Progress. 😝
// Wanna convert this a Redux app when I have the following features stubbed out:
// • Add Data Visualiztions
// • Add scrubbing
// • Full Screenage
// • Hook up to Soundcloud api
//   - Build SoundCloud search

/*
    Artists
    ===========================
    Andrew Bird
    http://www.andrewbird.net/

    Portugal, The Man.
    http://www.portugaltheman.com
    ===========================
*/

// Config
var helpers = {
    secondsToHMS: function secondsToHMS(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s;
    },
    randomProperty: function randomProperty(obj) {
        var keys = Object.keys(obj);
        return obj[keys[keys.length * Math.random() << 0]];
    },
    cycleThroughObject: function cycleThroughObject(obj, i) {
        var keys = Object.keys(obj);
        i < keys.length ? i++ : i = 0;
        return i;
    },
    getAverageVolume: function getAverageVolume(array) {
        var values = 0;
        var average;

        var length = array.length;

        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }

        average = values / length;
        return average;
    },
    hexToRgb: function hexToRgb(hex) {
        hex.replace("#", "");
        var bigint = parseInt(hex, 16);
        var r = bigint >> 16 & 255;
        var g = bigint >> 8 & 255;
        var b = bigint & 255;

        return r + "," + g + "," + b;
    }
};
var darkTheme = {
    overlayBg: "rgba(40,40,40,0.9)",
    textColor: "#eee",
    iconColor: "#fff",
    playButtonColor: "#000",
    brightTone: "#898787",
    lightTone: "#333333",
    midTone: "#222222",
    darkTone: "#111111",
    gradient: {
        primary: "#557c89",
        secondary: "#ace33b",
        tertiary: "#ffcf06"
    },
    visualizer: {
        rippleColor: "#557c89",
        barColor: "#fff"
    }
};
var lightTheme = {
    overlayBg: "rgba(255,255,255,0.9)",
    textColor: "#333",
    iconColor: "#3BD0E3",
    playButtonColor: "#fff",
    brightTone: "#fafafa",
    lightTone: "#eee",
    midTone: "#aaaaaa",
    darkTone: "#777",
    gradient: {
        primary: "#7E5589",
        secondary: "#3BD0E3",
        tertiary: "#FF067E"
    },
    visualizer: {
        rippleColor: "#FF067E",
        barColor: "#3BD0E3"
    }
};

//////////////////
// Player
//////////////////
/* 
    The meat and potatoes... of a somewhat messy, but very tasty, soup.
*/

var MusicPlayer = function (_React$Component) {
    _inherits(MusicPlayer, _React$Component);

    function MusicPlayer(props) {
        _classCallCheck(this, MusicPlayer);

        /*
            In componentDidMount we set this to reference the 
            corresponding <audio> DOM node so it is available as a global reference.
            There is probably a better way to do this. Look into it, Tedd.
        */

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.audioNode;

        _this.state = {
            hover: false,
            isPlaying: false,
            currentSongTimeElapsed: 0,
            currentSongDuration: 0,
            theme: _this.props.theme,
            showOverlay: null,
            audioNodeId: "audioNode" + _this.props.id,
            layoutConfig: {
                playerWidth: 360,
                scrubberBar: {
                    height: 7
                }
            }
        };
        return _this;
    }

    MusicPlayer.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        // Give our player component a global variable that references the corresponding HTML <audio> tag
        this.audioNode = document.getElementById(this.state.audioNodeId);

        /* 
            Song
            -----------------
            Setting up events that observe the audio element's actions
            = Play
            = Pause
            = Update elapsed time
        */
        var song = this.audioNode;
        // Set the duration time
        song.onloadedmetadata = function () {
            return _this2.setState({ currentSongDuration: song.duration });
        };
        // Update the elapsed playtime
        song.ontimeupdate = function () {
            return _this2.updateTime();
        };
        // Update when played
        song.onplay = function () {
            return _this2.setState({ isPlaying: true });
        };
        // Update when paused
        song.onpause = function () {
            return _this2.setState({ isPlaying: false });
        };
    };

    /* 
       Audio Events
    */

    MusicPlayer.prototype.updateTime = function updateTime() {
        var currentTime = this.audioNode.currentTime;
        this.setState({ currentSongTimeElapsed: currentTime });
    };

    MusicPlayer.prototype.pauseAudio = function pauseAudio() {
        this.audioNode.pause();
        this.setState({ isPlaying: false });
    };

    MusicPlayer.prototype.playAudio = function playAudio() {
        // Pause all first
        // Eventually we will want to move this to a isPlaying react state... Probably Redux, ya know?
        var audioNodes = document.getElementsByTagName("audio");
        _.each(audioNodes, function (n) {
            return document.getElementById(n.id).pause();
        });

        // Play selected song
        this.audioNode.play();
    };

    /* 
       Interaction Event Handlers
    */

    MusicPlayer.prototype.handleMouseEnter = function handleMouseEnter() {
        this.setState({ hover: true });
    };

    MusicPlayer.prototype.handleMouseLeave = function handleMouseLeave() {
        this.setState({ hover: false });
    };

    /* 
       Switch Theme
    */

    MusicPlayer.prototype.setTheme = function setTheme(theme) {
        if (theme == "Dark") {
            this.setState({ theme: darkTheme });
        } else {
            this.setState({ theme: lightTheme });
        }
    };

    MusicPlayer.prototype.enlargePlayer = function enlargePlayer() {
        this.state.layoutConfig.playerWidth = 500;
        this.setState({ layoutConfig: this.state.layoutConfig });
    };

    MusicPlayer.prototype.shrinkPlayer = function shrinkPlayer() {
        this.state.layoutConfig.playerWidth = 250;
        this.setState({ layoutConfig: this.state.layoutConfig });
    };

    MusicPlayer.prototype.showOverlay = function showOverlay() {
        this.setState({ showOverlay: true });
    };

    MusicPlayer.prototype.hideOverlay = function hideOverlay() {
        this.setState({ showOverlay: false });
    };
    /* 
       Styles
    */

    MusicPlayer.prototype.getStyles = function getStyles() {
        var hover = this.state.hover,
            isPlaying = this.state.isPlaying;
        return {
            background: "#fff",
            position: "relative",
            //overflow: "hidden",
            width: this.state.layoutConfig.playerWidth,
            transform: hover || isPlaying ? "translateY(-3px)" : "",
            boxShadow: hover || isPlaying ? "2px 6px 20px 0px rgba(0,0,0,0.6)" : "1px 0px 4px 0px rgba(0,0,0,0.66)",
            transition: "all ease 0.3s",
            margin: 10
        };
    };
    /* 
       Render Methods
    */

    MusicPlayer.prototype.renderOverlay = function renderOverlay() {
        if (this.state.showOverlay) {
            return React.createElement(MusicPlayerOverlay, {
                theme: this.state.theme,
                hideOverlay: this.hideOverlay.bind(this) });
        }
    };

    MusicPlayer.prototype.renderUtilities = function renderUtilities() {
        if (this.props.utilities) {
            return React.createElement(MusicPlayerUtilityBelt, {
                isPlaying: this.state.isPlaying,
                showOverlay: this.showOverlay.bind(this),
                theme: this.state.theme,
                enlarge: true });
        }
    };

    MusicPlayer.prototype.render = function render() {
        return React.createElement(
            "div",
            { id: "music-player",
                ref: "musicPlayer",
                style: this.getStyles(),
                onTouchStart: this.handleMouseEnter.bind(this),
                onTouchEnd: this.handleMouseLeave.bind(this),
                onMouseEnter: this.handleMouseEnter.bind(this),
                onMouseLeave: this.handleMouseLeave.bind(this) },
            React.createElement(AlbumArt, {
                albumArt: this.props.albumArt,
                hover: this.state.hover,
                isPlaying: this.state.isPlaying,
                theme: this.state.theme,
                trackInfo: this.props.trackInfo,
                playerId: this.props.id }),
            React.createElement(VisualizerContainer, {
                visualizerType: this.props.visualizerType,
                playerId: this.props.id,
                audioNodeId: this.state.audioNodeId,
                theme: this.state.theme,
                isPlaying: this.state.isPlaying,
                playerWidth: this.state.layoutConfig.playerWidth }),
            React.createElement(MusicPlayerControls, {
                audioNode: this.audioNode,
                isPlaying: this.state.isPlaying,
                play: this.playAudio.bind(this),
                pause: this.pauseAudio.bind(this),
                theme: this.state.theme,
                layoutConfig: this.state.layoutConfig,
                currentSongTimeElapsed: this.state.currentSongTimeElapsed,
                currentSongDuration: this.state.currentSongDuration }),
            this.renderUtilities(),
            this.renderOverlay(),
            React.createElement(AudioElement, {
                playerId: this.props.id,
                trackUrl: this.props.trackUrl,
                isPlaying: this.state.isPlaying })
        );
    };

    return MusicPlayer;
}(React.Component);

var AudioElement = function (_React$Component2) {
    _inherits(AudioElement, _React$Component2);

    function AudioElement() {
        _classCallCheck(this, AudioElement);

        return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
    }

    AudioElement.prototype.componentDidMount = function componentDidMount() {
        if (this.props.isPlaying) {
            this.refs.audioNode.play();
        }
    };

    AudioElement.prototype.render = function render() {
        var id = "audioNode" + this.props.playerId,
            trackUrl = this.props.trackUrl;
        return React.createElement(
            "audio",
            {
                id: id,
                ref: id,
                src: trackUrl,
                crossOrigin: "anonymous" },
            "Your browser does not support the audio tag."
        );
    };

    return AudioElement;
}(React.Component);

// Controls

var MusicPlayerControls = function (_React$Component3) {
    _inherits(MusicPlayerControls, _React$Component3);

    function MusicPlayerControls() {
        _classCallCheck(this, MusicPlayerControls);

        return _possibleConstructorReturn(this, _React$Component3.apply(this, arguments));
    }

    MusicPlayerControls.prototype.getStyles = function getStyles() {
        var bgColor = this.props.theme == darkTheme ? this.props.theme.midTone : this.props.theme.brightTone;
        return {
            background: bgColor,
            color: "#fff",
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            overflow: "visible",
            position: "relative",
            zIndex: 101
        };
    };

    MusicPlayerControls.prototype.getScrubTimeStyles = function getScrubTimeStyles() {
        return {
            fontSize: "0.8em",
            color: this.props.theme.textColor
        };
    };

    MusicPlayerControls.prototype.render = function render() {
        return React.createElement(
            "div",
            { style: this.getStyles() },
            React.createElement(
                "div",
                { style: this.getScrubTimeStyles() },
                helpers.secondsToHMS(this.props.currentSongTimeElapsed)
            ),
            React.createElement(PlayButton, this.props),
            React.createElement(
                "div",
                { style: this.getScrubTimeStyles() },
                helpers.secondsToHMS(this.props.currentSongDuration)
            ),
            React.createElement(Scrubber, this.props)
        );
    };

    return MusicPlayerControls;
}(React.Component);

var PlayButton = function (_React$Component4) {
    _inherits(PlayButton, _React$Component4);

    function PlayButton(props) {
        _classCallCheck(this, PlayButton);

        var _this5 = _possibleConstructorReturn(this, _React$Component4.call(this, props));

        _this5.state = {
            hover: false
        };
        return _this5;
    }

    PlayButton.prototype.handleMouseEnter = function handleMouseEnter() {
        this.setState({ hover: true });
    };

    PlayButton.prototype.handleMouseLeave = function handleMouseLeave() {
        this.setState({ hover: false });
    };

    PlayButton.prototype.handleClick = function handleClick() {
        if (this.props.audioNode.paused) {
            this.props.play();
        } else {
            this.props.pause();
        }
    };

    PlayButton.prototype.getStyles = function getStyles() {
        var hover = this.state.hover,
            isPlaying = this.props.isPlaying,
            dark = this.props.theme == darkTheme;
        return {
            background: hover || isPlaying ? dark ? "#111" : this.props.theme.iconColor : null,
            color: "#fff",
            height: 60,
            width: 60,
            marginBottom: hover || isPlaying ? 10 : -10,
            borderRadius: "50%",
            alignSelf: "flex-end",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all ease 0.3s"
        };
    };

    PlayButton.prototype.render = function render() {
        var hover = this.state.hover,
            isPlaying = this.props.isPlaying,
            icon = isPlaying ? React.createElement(PauseIcon, { theme: this.props.theme, active: hover || isPlaying }) : React.createElement(PlayIcon, { theme: this.props.theme, active: hover || isPlaying });
        return React.createElement(
            "div",
            { style: this.getStyles(),
                onClick: this.handleClick.bind(this),
                onMouseEnter: this.handleMouseEnter.bind(this),
                onMouseLeave: this.handleMouseLeave.bind(this) },
            icon
        );
    };

    return PlayButton;
}(React.Component);

var AlbumArt = function (_React$Component5) {
    _inherits(AlbumArt, _React$Component5);

    function AlbumArt() {
        _classCallCheck(this, AlbumArt);

        return _possibleConstructorReturn(this, _React$Component5.apply(this, arguments));
    }

    AlbumArt.prototype.getStyles = function getStyles() {
        return {
            width: "100%",
            height: "auto",
            display: "block",
            position: "relative",
            margin: 0,
            overflow: "hidden"
        };
    };

    AlbumArt.prototype.render = function render() {
        var id = this.props.playerId + "AlbumArt",
            imgId = this.props.playerId + "AlbumArtImg";
        return React.createElement(
            "div",
            {
                id: id,
                style: this.getStyles() },
            React.createElement(TrackInfoOverlay, this.props),
            React.createElement("img", {
                id: imgId,
                ref: "art",
                style: { width: "100%", transform: "translateZ(0)" },
                src: this.props.albumArt })
        );
    };

    return AlbumArt;
}(React.Component);

var TrackInfoOverlay = function (_React$Component6) {
    _inherits(TrackInfoOverlay, _React$Component6);

    function TrackInfoOverlay() {
        _classCallCheck(this, TrackInfoOverlay);

        return _possibleConstructorReturn(this, _React$Component6.apply(this, arguments));
    }

    TrackInfoOverlay.prototype.getStyles = function getStyles() {
        var hover = this.props.hover,
            isPlaying = this.props.isPlaying,
            dark = this.props.theme == darkTheme,
            tone = dark ? this.props.theme.midTone : this.props.theme.brightTone;
        return {
            width: "100%",
            height: "auto",
            background: "linear-gradient(transparent, " + tone + ")",
            display: "block",
            margin: 0,
            position: "absolute",
            zIndex: 100,
            bottom: 0,
            left: 0,
            padding: "100px 20px 20px",
            color: dark ? "#fff" : "#333",
            transition: "all ease 0.5s",
            textShadow: dark ? "2px 2px 2px rgba(0,0,0,0.5)" : "2px 2px 2px rgba(255,255,255,0.5)",
            transform: hover || isPlaying ? "translateY(0%)" : "translateY(100%)"
        };
    };

    TrackInfoOverlay.prototype.getNowPlayingStyles = function getNowPlayingStyles() {
        var isPlaying = this.props.isPlaying,
            dark = this.props.theme == darkTheme;
        return {
            fontSize: "0.5em",
            background: dark ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)",
            padding: "5px 10px",
            margin: "10px 0px",
            borderRadius: 3,
            fontWeight: 700,
            opacity: isPlaying ? 1 : 0,
            transform: isPlaying ? "translateY(0px)" : "translateY(-20px)",
            textTransform: "uppercase"
        };
    };

    TrackInfoOverlay.prototype.render = function render() {
        var isPlaying = this.props.isPlaying,
            nowPlaying = isPlaying ? "Now Playing" : null;
        return React.createElement(
            "div",
            { style: this.getStyles() },
            React.createElement(
                "span",
                { style: this.getNowPlayingStyles() },
                "Now Playing"
            ),
            React.createElement(
                "h3",
                { style: { margin: "10px 0px", fontSize: "1.8em" } },
                this.props.trackInfo.artist || null
            ),
            React.createElement(
                "p",
                { style: { margin: "5px 0px" } },
                this.props.trackInfo.title || null
            ),
            React.createElement(
                "p",
                { style: { margin: "10px 0px", fontSize: "0.8em", fontStyle: "italic" } },
                this.props.trackInfo.album || null
            )
        );
    };

    return TrackInfoOverlay;
}(React.Component);

// Scrubber

var Scrubber = function (_React$Component7) {
    _inherits(Scrubber, _React$Component7);

    function Scrubber() {
        _classCallCheck(this, Scrubber);

        return _possibleConstructorReturn(this, _React$Component7.apply(this, arguments));
    }

    Scrubber.prototype.getStyles = function getStyles() {
        return {
            width: "100%",
            height: "auto",
            position: "absolute",
            bottom: -this.props.layoutConfig.scrubberBar.height,
            left: 0
        };
    };

    Scrubber.prototype.render = function render() {
        var handle = this.props.isPlaying ? React.createElement(ScrubberHandle, { elapsed: this.props.elapsed, duration: this.props.duration }) : null;
        return React.createElement(
            "div",
            { id: "scrubber",
                style: this.getStyles() },
            React.createElement(ScrubberBar, this.props),
            handle
        );
    };

    return Scrubber;
}(React.Component);

var ScrubberBar = function (_React$Component8) {
    _inherits(ScrubberBar, _React$Component8);

    function ScrubberBar() {
        _classCallCheck(this, ScrubberBar);

        return _possibleConstructorReturn(this, _React$Component8.apply(this, arguments));
    }

    ScrubberBar.prototype.getStyles = function getStyles() {
        return {
            width: "100%",
            height: this.props.layoutConfig.scrubberBar.height,
            position: "absolute",
            bottom: 0, left: 0,
            transition: "all ease 0.3s"
        };
    };

    ScrubberBar.prototype.render = function render() {
        var classes = this.props.theme == darkTheme ? "scrollingGradientBackground dark" : "scrollingGradientBackground";
        return React.createElement("div", { style: this.getStyles(),
            className: classes });
    };

    return ScrubberBar;
}(React.Component);

var ScrubberHandle = function (_React$Component9) {
    _inherits(ScrubberHandle, _React$Component9);

    function ScrubberHandle() {
        _classCallCheck(this, ScrubberHandle);

        var _this10 = _possibleConstructorReturn(this, _React$Component9.call(this));

        _this10.state = {
            hover: false
        };
        return _this10;
    }

    ScrubberHandle.prototype.handleMouseOver = function handleMouseOver() {
        this.setState({ hover: true });
    };

    ScrubberHandle.prototype.handleMouseOut = function handleMouseOut() {
        this.setState({ hover: false });
    };

    ScrubberHandle.prototype.getStyles = function getStyles() {
        var hover = this.state.hover,
            scrubberPosition = this.props.elapsed / this.props.duration * 100;
        return {
            width: hover ? 20 : 15,
            height: hover ? 20 : 15,
            position: "absolute",
            top: hover ? -15 : -10,
            left: scrubberPosition + "%",
            borderRadius: "50%",
            border: "solid 2px #ddd",
            transition: "all ease 0.2s",
            cursor: "ew-resize",
            background: "radial-gradient(#fff, #ddd)",
            boxShadow: hover ? "0px 0px 8px 2px rgba(255,255,255,0.5), inset 0px 0px 2px rgba(0,0,0,0.4)" : "0px 0px 4px 0px rgba(0,0,0,0.3), inset 0px 0px 2px rgba(0,0,0,0.3)"
        };
    };

    ScrubberHandle.prototype.render = function render() {
        return React.createElement("div", { style: this.getStyles(),
            onMouseOver: this.handleMouseOver.bind(this),
            onMouseOut: this.handleMouseOut.bind(this) });
    };

    return ScrubberHandle;
}(React.Component);

// Utility Belt

var MusicPlayerUtilityBelt = function (_React$Component10) {
    _inherits(MusicPlayerUtilityBelt, _React$Component10);

    function MusicPlayerUtilityBelt() {
        _classCallCheck(this, MusicPlayerUtilityBelt);

        return _possibleConstructorReturn(this, _React$Component10.apply(this, arguments));
    }

    MusicPlayerUtilityBelt.prototype.getStyles = function getStyles() {
        return {
            width: "100%",
            height: "auto",
            background: this.props.theme.lightTone,
            display: "flex",
            position: "relative",
            zIndex: 100
        };
    };

    MusicPlayerUtilityBelt.prototype.getLiStyles = function getLiStyles() {
        return {
            listStyle: "none",
            flex: "1 0 auto",
            textAlign: "center",
            color: "#eee",
            textTransform: "uppercase",
            fontSize: "8px",
            letterSpacing: "1px",
            padding: "12px 0px 8px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexFlow: "row wrap"
        };
    };

    MusicPlayerUtilityBelt.prototype.getIconStyles = function getIconStyles() {
        return {
            height: 18
        };
    };

    MusicPlayerUtilityBelt.prototype.getTitleStyles = function getTitleStyles() {
        return {
            flex: "2 0 100%",
            marginTop: 12,
            color: this.props.theme.textColor
        };
    };

    MusicPlayerUtilityBelt.prototype.render = function render() {
        return React.createElement(
            "div",
            { style: this.getStyles() },
            React.createElement(
                "li",
                { style: this.getLiStyles(),
                    onClick: this.props.showOverlay },
                React.createElement(
                    "div",
                    { style: this.getLiStyles() },
                    React.createElement(VisualizerIcon, {
                        style: this.getIconStyles(),
                        theme: this.props.theme }),
                    React.createElement(
                        "span",
                        { style: this.getTitleStyles() },
                        "Visualizer"
                    )
                )
            ),
            React.createElement(
                "li",
                { style: this.getLiStyles(),
                    onClick: this.props.showOverlay },
                React.createElement(
                    "div",
                    { style: this.getLiStyles() },
                    React.createElement(SearchIcon, {
                        style: this.getIconStyles(),
                        theme: this.props.theme }),
                    React.createElement(
                        "span",
                        { style: this.getTitleStyles() },
                        "Search"
                    )
                )
            ),
            React.createElement(
                "li",
                { style: this.getLiStyles(),
                    onClick: this.props.showOverlay },
                React.createElement(
                    "div",
                    { style: this.getLiStyles() },
                    React.createElement(FullScreenIcon, {
                        style: this.getIconStyles(),
                        theme: this.props.theme }),
                    React.createElement(
                        "span",
                        { style: this.getTitleStyles() },
                        "Enlarge"
                    )
                )
            )
        );
    };

    return MusicPlayerUtilityBelt;
}(React.Component);
//Utility Overlay

var MusicPlayerOverlay = function (_React$Component11) {
    _inherits(MusicPlayerOverlay, _React$Component11);

    function MusicPlayerOverlay() {
        _classCallCheck(this, MusicPlayerOverlay);

        return _possibleConstructorReturn(this, _React$Component11.apply(this, arguments));
    }

    MusicPlayerOverlay.prototype.getOverlayStyles = function getOverlayStyles() {
        return {
            width: "100%",
            height: "100%",
            background: this.props.theme.overlayBg,
            display: "flex",
            position: "absolute",
            top: 0, left: 0,
            zIndex: 101
        };
    };

    MusicPlayerOverlay.prototype.getCloseIconStyles = function getCloseIconStyles() {
        var dark = this.props.theme == darkTheme;
        return {
            padding: 10,
            position: "absolute",
            right: 10, top: 10,
            background: dark ? null : "#fff"
        };
    };

    MusicPlayerOverlay.prototype.render = function render() {
        var dark = this.props.theme == darkTheme;
        return React.createElement(
            "div",
            { style: this.getOverlayStyles() },
            React.createElement(CloseIcon, {
                onClick: this.props.hideOverlay,
                color: dark ? "#fff" : this.props.theme.iconColor,
                style: this.getCloseIconStyles() })
        );
    };

    return MusicPlayerOverlay;
}(React.Component);

// Visualizer

var VisualizerContainer = function (_React$Component12) {
    _inherits(VisualizerContainer, _React$Component12);

    function VisualizerContainer() {
        _classCallCheck(this, VisualizerContainer);

        return _possibleConstructorReturn(this, _React$Component12.apply(this, arguments));
    }

    VisualizerContainer.prototype.getStyles = function getStyles() {
        var dark = this.props.theme == darkTheme,
            isPlaying = this.props.isPlaying;
        // Get dimension of album art
        // These are the dimensions we will map the visualizer to... for now..
        var albumId = this.props.playerId + "AlbumArt",
            width = this.props.playerWidth,
            height = this.props.playerWidth;

        return {
            position: "absolute",
            top: 0,
            left: 0,
            width: width,
            height: height,
            zIndex: 99,
            transition: "all ease 0.7s",
            opacity: isPlaying ? 1 : 0
        };
    };

    //background:  dark ? "rgba(20,20,20,0.2)" : "rgba(255,255,255,0.2)"

    VisualizerContainer.prototype.render = function render() {
        var id = "player" + this.props.playerId + "VisualizerContainer";
        return React.createElement(
            "div",
            { id: id, style: this.getStyles() },
            React.createElement(Visualizer, this.props)
        );
    };

    return VisualizerContainer;
}(React.Component);

var Visualizer = function (_React$Component13) {
    _inherits(Visualizer, _React$Component13);

    function Visualizer(props) {
        _classCallCheck(this, Visualizer);

        var _this14 = _possibleConstructorReturn(this, _React$Component13.call(this, props));

        _this14.state = {
            id: "player" + _this14.props.playerId + "Visualizer"
        };
        return _this14;
    }

    Visualizer.prototype.componentDidMount = function componentDidMount() {
        /*
            MOVE ALL OF THIS
            - This all should go into the MusicPlayer component and be passed through as props
            - Figure out best way to store and pass the Analyser, Media Element, etc...
         */
        // Get the audio data and format it for clean handoff to D3.js
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        var audioElement = document.getElementById(this.props.audioNodeId);
        var audioSrc = audioCtx.createMediaElementSource(audioElement);
        var analyser = audioCtx.createAnalyser();

        // Bind our analyser to the media element source.
        audioSrc.connect(analyser);
        audioSrc.connect(audioCtx.destination);

        /*
           D3 setup
        */
        // Setup the SVG
        var svgHeight = document.getElementById(this.state.id + "Container").offsetHeight;
        var svgWidth = document.getElementById(this.state.id + "Container").offsetWidth;
        function createSvg(parent, height, width) {
            return d3.select(parent).append('svg').attr('height', height).attr('width', width);
        }

        // Visualizer
        var graph = createSvg('#' + this.state.id, svgHeight, svgWidth);
        var frequencyData = new Uint8Array(255);
        switch (this.props.visualizerType) {
            case "RIPPLES":
                this.renderFrequencyRipples(graph, analyser, svgWidth, svgHeight);
                this.pulsateArt(analyser);
                break;
            case "BARS":
                this.renderFrequencyBars(graph, analyser, svgWidth, svgHeight);
                this.pulsateArt(analyser);
                break;
            default:
                this.renderFrequencyBars(graph, analyser, svgWidth, svgHeight);
                this.pulsateArt(analyser);
        }
    };

    Visualizer.prototype.renderFrequencyRipples = function renderFrequencyRipples(graph, analyser, svgWidth, svgHeight) {
        var i = 0;
        var frequencyData = new Uint8Array(svgWidth);
        var color = this.props.theme.visualizer.rippleColor;

        // NEED TO DO THIS THE REACT WAY!!
        // Continuously loop and update chart with frequency data.
        function renderChart() {
            requestAnimationFrame(renderChart);
            //var color = d3.hsl((i = (i + 1) % 360), 1, 0.66);
            //var color = helpers.randomProperty(gradient);
            // Copy frequency data to frequencyData array.
            analyser.getByteFrequencyData(frequencyData);

            graph.insert("circle", "rect").data(frequencyData).attr("cx", function (d, i) {
                return d * (svgWidth / frequencyData.length);
            }).attr("cy", function (d) {
                return svgHeight + 10;
            }).attr("r", 1e-6).style("stroke", color).style("stroke-opacity", 0.7).transition().duration(10000).ease(Math.sqrt).attr("r", 600).style("stroke-opacity", 0.001).remove();
        }
        // Run the loop
        renderChart();
    };

    Visualizer.prototype.pulsateArt = function pulsateArt(analyser) {
        var albumArt = document.getElementById(this.props.playerId + "AlbumArtImg");
        var frequencyData = new Uint8Array(8);

        function pulsate() {
            requestAnimationFrame(pulsate);
            // Copy frequency data to frequencyData array.
            analyser.getByteFrequencyData(frequencyData);
            // Get the average level
            var average = Math.ceil(helpers.getAverageVolume(frequencyData) / 10) * 10;
            // Pulsate the art
            albumArt.style.webkitFilter = "blur(" + average / 50 + "px)";
            albumArt.style.filter = "blur(" + average / 50 + "px)";
        }

        pulsate();
    };

    Visualizer.prototype.renderFrequencyBars = function renderFrequencyBars(graph, analyser, svgWidth, svgHeight) {
        var barPadding = 1;
        var i = 0;
        var color = this.props.theme.visualizer.barColor;
        var gradient = this.props.theme.gradient;
        var frequencyData = new Uint8Array(133);
        graph.selectAll('rect').data(frequencyData).enter().append('rect').attr('fill', function (d) {
            //return d3.hsl((d = (d + 1) % 360), 1, 0.66)
            //return d3.hsl((i = (i + 1) % 360), 1, 0.66)
            return color;
        }).attr('width', svgWidth / frequencyData.length - barPadding).attr('x', function (d, i) {
            return i * (svgWidth / frequencyData.length);
        });

        // NEED TO DO THIS THE REACT WAY!!
        // Continuously loop and update chart with frequency data.
        function renderChart() {
            requestAnimationFrame(renderChart);

            // Copy frequency data to frequencyData array.
            analyser.getByteFrequencyData(frequencyData);

            // Update d3 chart with new data.
            graph.selectAll('rect').data(frequencyData).attr('y', function (d) {
                return svgHeight - d;
            }).attr('height', function (d) {
                return d;
            });
        }
        // Run the loop
        renderChart();
    };

    Visualizer.prototype.render = function render() {
        return React.createElement("div", { id: this.state.id });
    };

    return Visualizer;
}(React.Component);

// Icons
/*
    Hey Tedd! Convert these to stateless components, eh?!
*/

var VisualizerIcon = function (_React$Component14) {
    _inherits(VisualizerIcon, _React$Component14);

    function VisualizerIcon() {
        _classCallCheck(this, VisualizerIcon);

        return _possibleConstructorReturn(this, _React$Component14.apply(this, arguments));
    }

    VisualizerIcon.prototype.render = function render() {
        return React.createElement(
            "svg",
            { onClick: this.props.onClick, version: "1.1", id: "Layer_1", x: "0px", y: "0px", height: this.props.style.height,
                viewBox: "0 0 263.1 200.4", "enable-background": "new 0 0 263.1 200.4" },
            React.createElement(
                "g",
                { id: "hF24br.tif" },
                React.createElement(
                    "g",
                    null,
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M138.1,100.2c0,31.5-0.2,62.9,0.2,94.4c0.1,6.1-3,5.6-7,5.7c-4.4,0.2-6.5-0.5-6.4-5.8 c0.1-54.9,0-109.9-0.1-164.8c0-8.2,0.3-16.3,0.1-24.5c-0.1-3.7,0.8-5.4,4.9-5.2c9.7,0.4,8.3-0.7,8.3,8.3 C138.2,38.9,138.1,69.6,138.1,100.2z" }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M113.1,99.2c0,23.5-0.1,46.9,0.1,70.4c0,4.7-1.4,6-5.9,5.8c-7.3-0.3-7.3-0.1-7.4-7.2 c-0.1-41.3-0.1-82.6-0.2-123.8c0-5.7,0.3-11.3,0.1-17c-0.1-3.3,1.2-4.3,4.4-4.2c10.6,0.2,8.8-0.8,8.8,8.7 C113.2,54.2,113.1,76.7,113.1,99.2z" }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M163.1,99.3c0,20.8-0.1,41.6,0.1,62.4c0,4.3-1.1,5.9-5.6,5.6c-8.8-0.4-7.7,0.6-7.7-7.9 c0-40.8,0-81.6,0-122.3c0-1.9,0.7-5.4,1.5-5.6c3.5-0.5,7.2-0.2,10.8,0.2c0.5,0.1,0.8,3,0.8,4.6C163.2,57.4,163.1,78.3,163.1,99.3z " }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M63.1,99.3c0,14-0.1,27.9,0.1,41.9c0.1,4.3-1.6,5.6-5.5,5.1c-1.1-0.1-2.3-0.1-3.5,0 c-3.2,0.4-4.4-1-4.3-4.3c0.1-10.8-0.1-21.6-0.1-32.4c0-17.5,0.2-34.9,0.1-52.4c0-4.3,1.6-5.6,5.5-5.1c1.1,0.1,2.3,0.1,3.5,0 c3.2-0.4,4.4,1,4.3,4.3C63.1,70.6,63.1,84.9,63.1,99.3z" }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M174.9,98.6c0-9,0.2-18-0.1-26.9c-0.1-3.9,1.4-4.8,5-4.7c9.7,0.3,8.3-0.9,8.4,8.2 c0.3,17.1-0.1,34.2,0,51.4c0,3.9-1.4,5.1-5,4.7c-1.5-0.2-3-0.1-4.5,0c-2.7,0.2-3.9-0.9-3.8-3.7C175,117.9,175,108.3,174.9,98.6 C175,98.6,175,98.6,174.9,98.6z" }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M88.1,99.7c0,8.6-0.2,17.3,0.1,25.9c0.1,3.9-1.3,4.8-4.9,4.7c-9.7-0.3-8.3,0.8-8.3-8.2 c-0.1-16.1,0.1-32.2-0.1-48.4c-0.1-4.2,0.8-6,5.4-5.7c8.9,0.4,7.7-0.7,7.8,7.8C88.2,83.7,88.1,91.7,88.1,99.7z" }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M38.1,99.3c0,4-0.1,8,0,11.9c0.1,3-1,4-4,4.1c-8.9,0.2-9.1,0.4-9.3-8.3c-0.2-6.6,0.2-13.3,0-19.9 c-0.1-3,1-4,4-4.1c8.9-0.2,9-0.4,9.3,8.3c0.1,2.6,0,5.3,0,8C38.2,99.3,38.2,99.3,38.1,99.3z" }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M213.1,99c0,3.5-0.3,7,0.1,10.4c0.4,4.1-1.5,5.3-5.2,4.9c-1-0.1-2-0.1-3,0c-3.8,0.5-5.3-0.9-5.1-4.9 c0.3-6.8,0.3-13.6,0-20.4c-0.2-4.1,1.5-5.3,5.2-4.9c1,0.1,2,0.1,3,0c3.8-0.5,5.5,0.9,5.1,5C212.9,92.3,213.1,95.7,213.1,99z" }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M13.3,99.3c0,7.4-4.5,10.5-11.6,7.7c-0.7-0.3-1.6-1.3-1.6-2.1c-0.1-4-0.1-7.9,0-11.9 c0-0.7,1.1-1.5,1.8-1.8c0.9-0.3,2-0.2,3-0.2C13.3,91,13.3,91,13.3,99.3z" }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M225.1,91.2c4.5,0,8.6,0,13,0c0,5.3,0,10.4,0,15.9c-4.2,0-8.4,0-13,0C225.1,101.9,225.1,96.8,225.1,91.2z"
                    }),
                    React.createElement("path", { fill: this.props.theme.iconColor, d: "M263.1,94.2c0,3.5,0,6.5,0,9.9c-4.3,0-8.4,0-12.9,0c0-3.2,0-6.4,0-9.9C254.3,94.2,258.4,94.2,263.1,94.2z"
                    })
                )
            )
        );
    };

    return VisualizerIcon;
}(React.Component);

var SearchIcon = function (_React$Component15) {
    _inherits(SearchIcon, _React$Component15);

    function SearchIcon() {
        _classCallCheck(this, SearchIcon);

        return _possibleConstructorReturn(this, _React$Component15.apply(this, arguments));
    }

    SearchIcon.prototype.render = function render() {
        return React.createElement(
            "svg",
            { height: this.props.style.height, viewBox: "0 0 18 17", version: "1.1" },
            React.createElement(
                "g",
                { id: "Page-1", stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd" },
                React.createElement(
                    "g",
                    { id: "Group", transform: "translate(-174.000000, -15.000000)", fill: this.props.theme.iconColor },
                    React.createElement("path", { d: "M184.037798,27.0294582 C186.885432,26.3541691 189,23.8455695 189,20.8541667 C189,17.3448573 186.089851,14.5 182.5,14.5 C178.910149,14.5 176,17.3448573 176,20.8541667 C176,23.8458689 178.114992,26.3546712 180.963057,27.0296609 C180.855406,27.2535459 180.795082,27.5046315 180.795082,27.769954 L180.795082,32.792546 C180.795082,33.7355468 181.551835,34.5 182.5,34.5 C183.4416,34.5 184.204918,33.7363468 184.204918,32.792546 L184.204918,27.769954 C184.204918,27.5046387 184.145014,27.2534571 184.037798,27.0294582 Z M182.553279,25.75 C185.289804,25.75 187.508197,23.5813793 187.508197,20.90625 C187.508197,18.2311207 185.289804,16.0625 182.553279,16.0625 C179.816753,16.0625 177.598361,18.2311207 177.598361,20.90625 C177.598361,23.5813793 179.816753,25.75 182.553279,25.75 Z", id: "Oval-1", transform: "translate(182.500000, 24.500000) rotate(50.000000) translate(-182.500000, -24.500000) " })
                )
            )
        );
    };

    return SearchIcon;
}(React.Component);

var FullScreenIcon = function (_React$Component16) {
    _inherits(FullScreenIcon, _React$Component16);

    function FullScreenIcon() {
        _classCallCheck(this, FullScreenIcon);

        return _possibleConstructorReturn(this, _React$Component16.apply(this, arguments));
    }

    FullScreenIcon.prototype.render = function render() {
        return React.createElement(
            "svg",
            { style: this.props.style,
                viewBox: "0 0 38 24",
                width: "20px",
                "enable-background": "new 0 0 38 24" },
            React.createElement(
                "g",
                null,
                React.createElement("path", { fill: this.props.theme.iconColor, d: "M0,0v24h38V0H0z M33,12H20V5h13V12z" })
            )
        );
    };

    return FullScreenIcon;
}(React.Component);

var PlayIcon = function (_React$Component17) {
    _inherits(PlayIcon, _React$Component17);

    function PlayIcon() {
        _classCallCheck(this, PlayIcon);

        return _possibleConstructorReturn(this, _React$Component17.apply(this, arguments));
    }

    PlayIcon.prototype.render = function render() {
        var active = this.props.active;
        return React.createElement(
            "svg",
            { height: "20px",
                viewBox: "0 0 39 42" },
            React.createElement(
                "g",
                { id: "Page-1",
                    stroke: "none",
                    "stroke-width": "1",
                    fill: "none",
                    "fill-rule": "evenodd" },
                React.createElement("path", {
                    d: "M0.784313725,41.5 L0.784313725,0 L38.2156863,20.75 L0.784313725,41.5 Z",
                    id: "Triangle-15",
                    fill: active ? "#fff" : this.props.theme.iconColor })
            )
        );
    };

    return PlayIcon;
}(React.Component);

var PauseIcon = function (_React$Component18) {
    _inherits(PauseIcon, _React$Component18);

    function PauseIcon() {
        _classCallCheck(this, PauseIcon);

        return _possibleConstructorReturn(this, _React$Component18.apply(this, arguments));
    }

    PauseIcon.prototype.render = function render() {
        var active = this.props.active;
        return React.createElement(
            "svg",
            { height: "20px", viewBox: "0 0 23 23", version: "1.1" },
            React.createElement(
                "g",
                { id: "Page-1", stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd" },
                React.createElement(
                    "g",
                    { id: "Rectangle-68-+-Rectangle-62", transform: "translate(0.000000, 1.000000)", fill: active ? "#fff" : this.props.theme.iconColor },
                    React.createElement("rect", { id: "Rectangle-68", x: "0", y: "-0.48", width: "8.21428571", height: "22.48" }),
                    React.createElement("rect", { id: "Rectangle-62", x: "14.7857143", y: "-0.48", width: "8.21428571", height: "22.48" })
                )
            )
        );
    };

    return PauseIcon;
}(React.Component);

var CloseIcon = function (_React$Component19) {
    _inherits(CloseIcon, _React$Component19);

    function CloseIcon() {
        _classCallCheck(this, CloseIcon);

        return _possibleConstructorReturn(this, _React$Component19.apply(this, arguments));
    }

    CloseIcon.prototype.render = function render() {
        return React.createElement(
            "svg",
            { version: "1.1", id: "Layer_1", x: "0px", y: "0px",
                height: this.props.height || "30px",
                style: this.props.style,
                onClick: this.props.onClick,
                viewBox: "0 0 11.8 11.8", "enable-background": "new 0 0 11.8 11.8" },
            React.createElement("line", { fill: "none", stroke: this.props.color, "stroke-width": "3", "stroke-linejoin": "bevel", "stroke-miterlimit": "10", x1: "1.1", y1: "1.1", x2: "10.7", y2: "10.7" }),
            React.createElement("line", { fill: "none", stroke: this.props.color, "stroke-width": "3", "stroke-linejoin": "bevel", "stroke-miterlimit": "10", x1: "1.1", y1: "10.7", x2: "10.7", y2: "1.1" })
        );
    };

    return CloseIcon;
}(React.Component);

// Theme Toggle

var ThemeToggle = function (_React$Component20) {
    _inherits(ThemeToggle, _React$Component20);

    function ThemeToggle() {
        _classCallCheck(this, ThemeToggle);

        return _possibleConstructorReturn(this, _React$Component20.apply(this, arguments));
    }

    ThemeToggle.prototype.getStyles = function getStyles() {
        var dark = this.props.theme == darkTheme,
            playerHover = this.props.playerHover;
        return {
            position: "absolute",
            top: 10,
            right: 10,
            width: "auto",
            height: "auto",
            color: "#fff",
            padding: 4,
            zIndex: 101,
            transform: playerHover ? "translateX(0%)" : "translateX(0%)",
            transition: "all ease 0.5s",
            background: dark ? "rgba(0,0,0,0.66)" : "rgba(255,255,255,0.66)"
        };
    };

    ThemeToggle.prototype.render = function render() {
        return React.createElement(
            "div",
            { style: this.getStyles() },
            React.createElement(ThemeToggleButton, { title: "Dark",
                setAsActive: this.props.setTheme }),
            React.createElement(ThemeToggleButton, { title: "Light",
                setAsActive: this.props.setTheme })
        );
    };

    return ThemeToggle;
}(React.Component);

var ThemeToggleButton = function (_React$Component21) {
    _inherits(ThemeToggleButton, _React$Component21);

    function ThemeToggleButton(props) {
        _classCallCheck(this, ThemeToggleButton);

        var _this22 = _possibleConstructorReturn(this, _React$Component21.call(this, props));

        _this22.state = {
            hover: false
        };
        return _this22;
    }

    ThemeToggleButton.prototype.handleClick = function handleClick() {
        this.props.setAsActive(this.props.title);
    };

    ThemeToggleButton.prototype.handleMouseEnter = function handleMouseEnter() {
        this.setState({ hover: true });
    };

    ThemeToggleButton.prototype.handleMouseLeave = function handleMouseLeave() {
        this.setState({ hover: false });
    };

    ThemeToggleButton.prototype.getStyles = function getStyles() {
        var hover = this.state.hover;
        return {
            padding: "6px 12px",
            cursor: "pointer",
            background: hover ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.5)",
            fontSize: 12
        };
    };

    ThemeToggleButton.prototype.render = function render() {
        return React.createElement(
            "div",
            { style: this.getStyles(),
                onClick: this.handleClick.bind(this),
                onMouseEnter: this.handleMouseEnter.bind(this),
                onMouseLeave: this.handleMouseLeave.bind(this) },
            this.props.title
        );
    };

    return ThemeToggleButton;
}(React.Component);

/////////////////
// Application
////////////////
/* 
    This is just being used to
    center the player on the screen and add a nice background
*/

var App = function (_React$Component22) {
    _inherits(App, _React$Component22);

    function App() {
        _classCallCheck(this, App);

        return _possibleConstructorReturn(this, _React$Component22.apply(this, arguments));
    }

    App.prototype.getAppStyles = function getAppStyles() {
        return {
            background: "linear-gradient(white, #eee)",
            width: "100%", height: "100%",
            position: "absolute",
            top: 0, left: 0,
            padding: 10,
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "center",
            alignItems: "center"
        };
    };

    App.prototype.render = function render() {
        return React.createElement(
            "div",
            { id: "app", style: this.getAppStyles() },
            React.createElement(
                "h1",
                { style: { flex: "2 0 100%" } },
                "Frequency Ripples"
            ),
            React.createElement(MusicPlayer, {
                id: "2",
                visualizerType: "RIPPLES",
                theme: darkTheme,
                trackInfo: {
                    title: "Imitosis",
                    artist: "Andrew Bird",
                    album: "Armchair Apocrypha"
                },
                trackUrl: "https://s3-us-west-2.amazonaws.com/teddarcuri.monarch/Andrew+Bird+-+Imitosis.mp3",
                albumArt: "https://s3-us-west-2.amazonaws.com/teddarcuri.monarch/andrew+bird.jpg",
                utilities: true }),
            React.createElement(MusicPlayer, {
                id: "3",
                visualizerType: "RIPPLES",
                theme: lightTheme,
                trackInfo: {
                    title: "Guns & Dogs",
                    artist: "Portugal, The Man",
                    album: "The Satanic Satanist"
                },
                trackUrl: "https://s3-us-west-2.amazonaws.com/teddarcuri.monarch/Portugal.+The+Man+-+Guns+%26+Dogs+-+The+Satanic+Satanist.mp3",
                albumArt: "http://ecx.images-amazon.com/images/I/61X7CiBpZ6L.jpg",
                utilities: true }),
            React.createElement(
                "h1",
                { style: { flex: "2 0 100%" } },
                "Frequency Bars"
            ),
            React.createElement(MusicPlayer, {
                id: "22",
                visualizerType: "BARS",
                theme: darkTheme,
                trackInfo: {
                    title: "Imitosis",
                    artist: "Andrew Bird",
                    album: "Armchair Apocrypha"
                },
                trackUrl: "https://s3-us-west-2.amazonaws.com/teddarcuri.monarch/Andrew+Bird+-+Imitosis.mp3",
                albumArt: "https://s3-us-west-2.amazonaws.com/teddarcuri.monarch/andrew+bird.jpg",
                utilities: true }),
            React.createElement(MusicPlayer, {
                id: "31",
                visualizerType: "BARS",
                theme: lightTheme,
                trackInfo: {
                    title: "Guns & Dogs",
                    artist: "Portugal, The Man",
                    album: "The Satanic Satanist"
                },
                trackUrl: "https://s3-us-west-2.amazonaws.com/teddarcuri.monarch/Portugal.+The+Man+-+Guns+%26+Dogs+-+The+Satanic+Satanist.mp3",
                albumArt: "http://ecx.images-amazon.com/images/I/61X7CiBpZ6L.jpg",
                utilities: true })
        );
    };

    return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById("app"));