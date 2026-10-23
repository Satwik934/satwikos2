
"use client";

import { useEffect, useRef, useState } from "react";

type WaveType = "square" | "sawtooth" | "triangle";

export default function FourierBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef({
    harmonics: 5,
    speed: 1,
    waveType: "square" as WaveType,
    playing: true,
  });

  const [harmonics, setHarmonics] = useState(5);
  const [speed, setSpeed] = useState(1);
  const [waveType, setWaveType] = useState<WaveType>("square");
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    settingsRef.current = {
      harmonics,
      speed,
      waveType,
      playing,
    };
  }, [harmonics, speed, waveType, playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let time = 0;
    let lastTime = 0;
    let history: number[] = [];
    let previousType = "";
    let previousHarmonics = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      history = [];
    };

    const getTerm = (i: number, type: WaveType) => {
      if (type === "sawtooth") {
        const n = i + 1;
        return {
          n,
          amplitude: (2 / (Math.PI * n)) * (i % 2 ? -1 : 1),
        };
      }

      if (type === "triangle") {
        const n = 2 * i + 1;
        return {
          n,
          amplitude:
            (8 / (Math.PI * Math.PI * n * n)) *
            (i % 2 ? -1 : 1),
        };
      }

      const n = 2 * i + 1;

      return {
        n,
        amplitude: 4 / (Math.PI * n),
      };
    };

    const draw = (timestamp: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      const settings = settingsRef.current;

      if (
        settings.waveType !== previousType ||
        settings.harmonics !== previousHarmonics
      ) {
        history = [];
        previousType = settings.waveType;
        previousHarmonics = settings.harmonics;
      }

      ctx.clearRect(0, 0, width, height);

      // Scientific grid
      ctx.strokeStyle = "rgba(74,222,128,0.07)";
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const mobile = width < 420;

      const centerX = width * (mobile ? 0.27 : 0.25);
      const centerY = height * 0.5;

      const baseRadius = Math.min(
        height * 0.25,
        width * (mobile ? 0.22 : 0.17)
      );

      const waveStart = width * (mobile ? 0.55 : 0.53);

      let x = centerX;
      let y = centerY;

      // Draw every Fourier epicycle
      for (let i = 0; i < settings.harmonics; i++) {
        const { n, amplitude } = getTerm(i, settings.waveType);

        const radius = Math.abs(amplitude) * baseRadius;
        const angle = n * time + (amplitude < 0 ? Math.PI : 0);

        // Orbit
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.strokeStyle =
          i === 0
            ? "rgba(74,222,128,0.6)"
            : "rgba(74,222,128,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        const nextX = x + radius * Math.cos(angle);
        const nextY = y - radius * Math.sin(angle);

        // Rotating vector
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nextX, nextY);
        ctx.strokeStyle = i === 0 ? "#bbf7d0" : "#4ade80";
        ctx.lineWidth = i === 0 ? 2 : 1.3;
        ctx.stroke();

        // Vector joint
        ctx.beginPath();
        ctx.arc(nextX, nextY, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#86efac";
        ctx.fill();

        x = nextX;
        y = nextY;
      }

      // Connection to the waveform
      ctx.beginPath();
      ctx.setLineDash([4, 5]);
      ctx.moveTo(x, y);
      ctx.lineTo(waveStart, y);
      ctx.strokeStyle = "rgba(74,222,128,0.5)";
      ctx.stroke();
      ctx.setLineDash([]);

      // Record signal
      if (settings.playing) {
        history.unshift(y);

        const maxPoints = Math.max(
          1,
          Math.floor(width - waveStart - 10)
        );

        if (history.length > maxPoints) {
          history.pop();
        }
      }

      // Glowing waveform
      ctx.beginPath();

      history.forEach((value, index) => {
        if (index === 0) {
          ctx.moveTo(waveStart, value);
        } else {
          ctx.lineTo(waveStart + index, value);
        }
      });

      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#4ade80";
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Advance animation
      if (settings.playing && lastTime) {
        const delta = Math.min(timestamp - lastTime, 40);
        time += (delta / 1000) * settings.speed * 1.4;
      }

      lastTime = timestamp;
      frame = requestAnimationFrame(draw);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const options: WaveType[] = [
    "square",
    "sawtooth",
    "triangle",
  ];

  return (
    <div className="w-full rounded-xl border border-green-900/70 bg-[#030803]/95 p-4 font-mono shadow-[0_0_50px_rgba(34,197,94,0.08)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-green-400">
            ◉ FOURIER_LAB.EXE
          </p>
          <p className="mt-1 text-[10px] text-green-800">
            REAL-TIME SIGNAL SYNTHESIS
          </p>
        </div>

        <span className="text-[10px] text-green-400">
          {playing ? "● LIVE" : "◼ PAUSED"}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="h-[260px] w-full rounded-md bg-black/40 sm:h-[320px]"
        aria-label="Animated Fourier epicycles and waveform"
        role="img"
      />

      <div className="mt-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {options.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setWaveType(type)}
              className={`rounded-md border px-3 py-2 text-xs capitalize transition ${
                waveType === type
                  ? "border-green-400 bg-green-900/40 text-green-300"
                  : "border-green-900 text-green-700 hover:text-green-400"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-gray-400">
              Harmonics
            </span>
            <span className="text-green-400">
              {harmonics}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="25"
            value={harmonics}
            onChange={(e) =>
              setHarmonics(Number(e.target.value))
            }
            className="w-full accent-green-400"
            aria-label="Number of Fourier harmonics"
          />
        </div>

        <div>
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-gray-400">
              Animation speed
            </span>
            <span className="text-green-400">
              {speed.toFixed(1)}x
            </span>
          </div>

          <input
            type="range"
            min="0.2"
            max="3"
            step="0.2"
            value={speed}
            onChange={(e) =>
              setSpeed(Number(e.target.value))
            }
            className="w-full accent-green-400"
            aria-label="Fourier animation speed"
          />
        </div>

        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          className="w-full rounded-md border border-green-800 py-3 text-xs text-green-400 transition hover:bg-green-900/30"
        >
          {playing ? "Ⅱ PAUSE SIMULATION" : "▶ RESUME SIMULATION"}
        </button>
      </div>

      <div className="mt-4 border-t border-green-900/50 pt-3 text-[10px] text-green-800">
        SATWIK OS // MATHEMATICAL VISUALIZATION ENGINE
      </div>
    </div>
  );
}
