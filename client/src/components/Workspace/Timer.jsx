// src/components/Timer.jsx
import React, { useState, useEffect } from 'react';
import { AlarmClock, ChevronLeft, CirclePlay, CirclePause, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Timer = ({ problemId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Timer interval
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Reset timer and collapse on problem change
  useEffect(() => {
    setIsRunning(false);
    setSeconds(0);
    setIsExpanded(false);
  }, [problemId]);

  // Format time as HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  };

  // Toggle timer expansion and start if not running
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && !isRunning) {
      setIsRunning(true);
    }
  };

  // Toggle play/pause
  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  // Reset timer
  const handleReset = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  // Hide timer (collapse)
  const handleHide = () => {
    setIsExpanded(false);
  };

  return (
    <div className="flex items-center gap-1 satoshi mr-34">
      {isExpanded ? (
        <div className="flex items-center gap-1">
          {/* Component 1: Hide Timer Button */}
          <div className="bg-[#2A2A2A] rounded-sm rounded-r-none px-3 py-2 flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleHide}
                    className="text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out h-full flex items-center cursor-pointer"
                    aria-label="Hide Timer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                  Hide Timer
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* Component 2: Play/Pause + Timer Display */}
          <div className="bg-[#2A2A2A] rounded-none px-3 py-2 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handlePlayPause}
                    className="text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out h-full flex items-center cursor-pointer"
                    aria-label={isRunning ? 'Pause Timer' : 'Start Timer'}
                  >
                    {isRunning ? <CirclePause className="h-5 w-5" /> : <CirclePlay className="h-5 w-5" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                  {isRunning ? 'Pause Timer' : 'Start Timer'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handlePlayPause}
                    className="text-sm font-mono text-white h-full flex items-center cursor-pointer"
                    aria-label={isRunning ? 'Pause Timer' : 'Start Timer'}
                  >
                    {formatTime(seconds)}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                  {isRunning ? 'Pause Timer' : 'Start Timer'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* Component 3: Reset Timer Button */}
          <div className="bg-[#2A2A2A] rounded-sm rounded-l-none px-3 py-2 flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleReset}
                    className="text-[#b3b3b3] hover:text-[#f5b210] transition-all duration-300 ease-in-out h-full flex items-center cursor-pointer"
                    aria-label="Reset Timer"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                  Reset Timer
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ) : (
        <div className="bg-[#2A2A2A] rounded-sm px-3 py-2 flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleToggleExpand}
                  className={`h-5 w-5 cursor-pointer ${
                    isRunning ? 'text-[#f5b210]' : 'text-[#b3b3b3] hover:text-[#f5b210]'
                  } transition-all duration-300 ease-in-out h-full flex items-center`}
                  aria-label="Start Timer"
                >
                  <AlarmClock className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1A1A1A] border-[#333333] text-white text-xs font-satoshi">
                Start Timer
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default Timer;