import { useRef, useEffect, FC } from "react";

const AudioPlayer: FC<{audioSrc: string}> = ({ audioSrc }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
  
    useEffect(() => {
      const audioElement = audioRef.current;
  
      if (audioSrc && audioElement && audioElement.src !== audioSrc) {
        audioElement.src = audioSrc;
        audioElement.play()
          .then(() => console.log("Audio Started!"))
          .catch((error) => console.error('Error playing audio:', error));
      }
  
      return () => {
        if (audioElement) {
          audioElement.pause();
        }
      };
    }, [audioSrc]);
  
    return (
      <audio controls ref={audioRef} />
    );
  }

  export default AudioPlayer;