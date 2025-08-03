import { useEffect, useState, useRef } from "react";
import {
  faCaretSquareRight,
  faCaretSquareLeft,
  faCirclePlay,
  faCirclePause
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("https://playground.4geeks.com/sound/songs");
        const data = await response.json();
        setSongs(data.songs);
      } catch {
        console.log("Failed to fetch songs");
      }
    };
    fetchSongs();
  }, []);

  const handlePlay = (index) => {
    if (!songs.length) return;
    const songUrl = `https://playground.4geeks.com${songs[index].url}`;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const newAudio = new Audio(songUrl);
    audioRef.current = newAudio;
    newAudio.play();
    setIsPlaying(true);
    setCurrentIndex(index);

    newAudio.onended = () => {
      handleNext();
    };
  };

  const togglePlayPause = () => {
    if (!songs.length) return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      handlePlay(currentIndex);
    }
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    handlePlay(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % songs.length;
    handlePlay(nextIndex);
  };

  const handleSelectSong = (index) => {
    handlePlay(index);
  };

  return (
    <div>
      <h1>Top Hits</h1>
      <ol className="list-group list-group-numbered">
        {songs.map((song, idx) => (
          <li
            key={song.id}
            className={`list-group-item list-group-item-action ${
              currentIndex === idx ? "bg-dark text-white" : "bg-black text-white"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => handleSelectSong(idx)}
          >
            {song.name}
          </li>
        ))}
      </ol>

      <div className="sticky-bottom bg-secondary p-3">
        <div className="mx-auto d-flex column-gap-3 justify-content-center" style={{ width: "200px" }}>
          <FontAwesomeIcon
            icon={faCaretSquareLeft}
            className="p-1"
            onClick={handlePrev}
            style={{ cursor: "pointer" }}
            size="2x"
          />
          <FontAwesomeIcon
            icon={isPlaying ? faCirclePause : faCirclePlay}
            className="p-1"
            onClick={togglePlayPause}
            style={{ cursor: "pointer" }}
            size="2x"
          />
          <FontAwesomeIcon
            icon={faCaretSquareRight}
            className="p-1"
            onClick={handleNext}
            style={{ cursor: "pointer" }}
            size="2x"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
