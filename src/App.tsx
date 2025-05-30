import { useState, useRef, useEffect } from 'react';
import './App.css'

type SplitEntry = {
  time: number;
  diff: number;
  timeStamp: number;
};

const formatTime = (ms: number): string => {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const centisec = Math.floor((ms % 1000) / 10);
  return `${String(min).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}.${String(centisec).padStart(2, '0')}`;
}

function App() {
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [splits, setSplits] = useState<SplitEntry[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime(t => t + 10);
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [running]);

  const handleSplit = () => {
    const last = splits.length > 0 ? splits[splits.length -1].timeStamp : 0;
    setSplits(prev => [
      ...prev,
      {
        time,
        diff: time - last,
        timeStamp: time
      }
    ]);
  }

  const handleReset = () => {
    setTime(0);
    setSplits([]);
  }

  return (
    <>
      <div className='container'>
        <h1 className='main-time'>{formatTime(time)}</h1>
        <div className='buttons'>
          <button onClick={() => setRunning(!running)}>{running ? 'Pause' : 'Start'}</button>
          <button onClick={handleSplit} disabled={!running}>Split</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
      
    </>
  )
}

export default App
