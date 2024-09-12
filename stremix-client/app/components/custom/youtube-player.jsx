import { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
const MATCH_START_QUERY = /[?&#](?:start|t)=([0-9hms]+)/;
const MATCH_END_QUERY = /[?&#]end=([0-9hms]+)/;
const MATCH_START_STAMP = /(\d+)(h|m|s)/g;
const MATCH_NUMERIC = /^\d+$/;

// Parse YouTube URL for a start time param, ie ?t=1h14m30s
// and return the start time in seconds
function parseTimeParam(url, pattern) {
  if (Array.isArray(url)) {
    return undefined;
  }
  const match = url.match(pattern);
  if (match) {
    const stamp = match[1];
    if (stamp.match(MATCH_START_STAMP)) {
      return parseTimeString(stamp);
    }
    if (MATCH_NUMERIC.test(stamp)) {
      return parseInt(stamp);
    }
  }
  return undefined;
}

function parseTimeString(stamp) {
  let seconds = 0;
  let array = MATCH_START_STAMP.exec(stamp);
  while (array !== null) {
    const [, count, period] = array;
    if (period === "h") seconds += parseInt(count, 10) * 60 * 60;
    if (period === "m") seconds += parseInt(count, 10) * 60;
    if (period === "s") seconds += parseInt(count, 10);
    array = MATCH_START_STAMP.exec(stamp);
  }
  return seconds;
}

function parseStartTime(url) {
  return parseTimeParam(url, MATCH_START_QUERY);
}

function parseEndTime(url) {
  return parseTimeParam(url, MATCH_END_QUERY);
}

const playing = false;
const muted = false;
const controls = true;
const playsinline = false;
const rel = false;

let apiLoaded = false;
const playerInitializers = new Map();

const YouTubePlayer = ({ id, playerKey, ...rest }) => {
  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  YouTubePlayer.propTypes = {
    id: PropTypes.string.isRequired,
    playerKey: PropTypes.string.isRequired,
    className: PropTypes.string,
  };

  const url = `https://www.youtube.com/watch?v=${id}`;

  const initializeYouTubePlayer = useCallback(() => {
    if (!id || !playerRef.current) return;
    playerInstanceRef.current = new window.YT.Player(playerRef.current, {
      width: "100%",
      height: "450px", // Replace with your height
      videoId: id,
      playerVars: {
        autoplay: playing ? 1 : 0,
        mute: muted ? 1 : 0,
        controls: controls ? 1 : 0,
        start: parseStartTime(url),
        end: parseEndTime(url),
        playsinline: playsinline ? 1 : 0,
        iv_load_policy: 1,
        rel: rel ? 1 : 0,
      },
    });
  }, [id, url]);

  useEffect(() => {
    playerInitializers.set(String(playerKey), initializeYouTubePlayer);

    if (!apiLoaded) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];

      if (firstScriptTag.parentNode)
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        apiLoaded = true;
        playerInitializers.forEach((initialize) => initialize());
      };
    } else if (apiLoaded) {
      initializeYouTubePlayer();
    }

    return () => {
      playerInitializers.delete(playerKey);
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
    };
  }, [initializeYouTubePlayer, playerKey]);

  const handlePlay = () => {
    if (playerInstanceRef.current) {
      if (isPlaying) {
        playerInstanceRef.current.pauseVideo();
      } else {
        playerInstanceRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    if (playerInstanceRef.current) {
      playerInstanceRef.current.stopVideo();
      setIsPlaying(false);
    }
  };

  // Toggle playback state
  const togglePlayback = () => {
    if (isPlaying) {
      handleStop();
    } else {
      handlePlay();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div {...rest} className="w-full">
      <div className="relative pb-[56.25%] pt-6 h-0 overflow-hidden rounded-md">
        <div ref={playerRef} className="absolute top-0 left-0 w-full h-full"></div>
        <button
          className="absolute inset-0 bg-transparent cursor-not-allowed"
          onClick={togglePlayback}
        ></button>
      </div>
    </div>
  );
};

export { YouTubePlayer };
