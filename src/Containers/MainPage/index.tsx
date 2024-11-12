import React, { useState, useEffect, useCallback } from "react";

interface IPositions {
  top: string;
  left: string;
  number: number;
}

const MainPages = () => {
  const [count, setCount] = useState(5);
  const [positions, setPositions] = useState<IPositions[]>([]);
  const [clickedNumbers, setClickedNumbers] = useState<number[]>([]);
  const [expectedNumber, setExpectedNumber] = useState(1);
  const [isError, setIsError] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [youWin, setYouWin] = useState<boolean>(false);
  const [reStart, setReStart] = useState<boolean>(false);
  const [timer, setTimer] = useState(0); // Timer in milliseconds
  const [isPlaying, setIsPlaying] = useState(false);

  const generatePositions = (num: number) => {
    const newPositions = Array.from({ length: num }, (_, index) => ({
      top: Math.floor(Math.random() * 90) + "%",
      left: Math.floor(Math.random() * 90) + "%",
      number: index + 1,
    }));
    setPositions(newPositions);
    setClickedNumbers([]);
    setExpectedNumber(1);
    setIsError(false);
    setTimer(0);
    setIsPlaying(true);
  };

  const handleClick = useCallback(
    (number: number) => {
      if (number === expectedNumber) {
        setClickedNumbers((prev) => [...prev, number]);
        setIsError(false);
        if (number === count) {
          setYouWin(true);
          setIsPlaying(false);
        } else setExpectedNumber((prev) => prev + 1);
      } else {
        setIsError(true);
      }
    },
    [count, expectedNumber]
  );

  const handlePlay = () => {
    setReStart(true);
    generatePositions(count);
  };

  const handleRestart = () => {
    setReStart(false);
    setClickedNumbers([]);
    setExpectedNumber(1);
    setIsError(false);
    setPositions([]);
    setCount(5);
    setIsAutoPlay(false);
    setYouWin(false);
    setTimer(0);
    setIsPlaying(false);
  };

  const handleAutoPlayToggle = () => {
    setIsAutoPlay((prev) => !prev);
  };

  useEffect(() => {
    let autoPlayInterval: NodeJS.Timeout | null = null;
    if (isAutoPlay) {
      autoPlayInterval = setInterval(() => {
        if (expectedNumber <= count) {
          handleClick(expectedNumber);
        } else {
          setIsAutoPlay(false);
        }
      }, 1000);
    }

    return () => {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    };
  }, [isAutoPlay, expectedNumber, count, handleClick]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timerInterval = setInterval(() => {
        setTimer((prevTime) => prevTime + 100); // Increment by 100 ms
      }, 100);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isPlaying]);

  const remainingPositions = positions.filter(
    (pos) => !clickedNumbers.includes(pos.number)
  );

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ height: 200, display: "block" }}>
        {youWin ? (
          <h3 style={{ color: "#5E7544" }}>ALL CLEARED</h3>
        ) : isError ? (
          <h3 style={{ color: "red" }}>ERROR</h3>
        ) : (
          <h3>LET'S PLAY</h3>
        )}

        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ margin: 0 }}>Points:</p>
          <input
            type="number"
            style={{ height: "20px", width: "150px", fontSize: "12px" }}
            onChange={(e) => setCount(Number(e.target.value))}
            value={count}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={{ margin: 0 }}>Time: {(timer / 1000).toFixed(1)} s</p>{" "}
          {/* Display timer in tenths */}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div>
            {!reStart ? (
              <button onClick={handlePlay}>Play</button>
            ) : (
              <button onClick={handleRestart}>Restart</button>
            )}
          </div>
          {reStart && (
            <button onClick={handleAutoPlayToggle}>
              {isAutoPlay ? "Auto Play Off" : "Auto Play On"}
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100vh",
          height: "100vh",
          border: "1px solid #000",
        }}
      >
        {remainingPositions.map((pos) => (
          <button
            disabled={isError}
            key={pos.number}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              fontSize: "12px",
              fontWeight: "bold",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              border: "1px solid #A58081",
            }}
            onClick={() => handleClick(pos.number)}
          >
            <div>{pos.number}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainPages;
