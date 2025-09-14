import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// Import only the available icons from lucide-react.  FlagCheckered does not
// exist in the icon set, so we fall back to the generic Flag for the finish line.
import { Car, Flag } from 'lucide-react';
import {
  Button,
} from './components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/ui/card';
import { Input } from './components/ui/input';
import { Progress } from './components/ui/progress';

// A selection of longer passages to provide variety when racing.
const QUOTES: string[] = [
  `Typing is the future of communication. In a world where words travel faster than sound, the ability to express yourself rapidly and accurately is both an art and a science. Every keystroke is a small step on a long journey, and your speed is your fuel.`,
  `Programming is like composing a symphony with logic and syntax. Each line of code contributes to a larger narrative, weaving variables and functions into a coherent melody. As you type, the melody unfolds, and the race against time begins.`,
  `The open road stretched out before them, a ribbon of possibilities twisting through a landscape of endless potential. The roar of engines was replaced by the rhythmic tapping of keys, and the drivers — flesh and silicon alike — raced toward the horizon of mastery.`,
  `Practice makes perfect. The more you type, the more your muscles remember the rhythm of the keys. Soon, your fingers dance across the keyboard effortlessly, and the words appear on the screen as if by magic.`,
  `Technology connects us in ways our ancestors could never have imagined. Through the simple act of typing, we send our thoughts across oceans, share our stories, and race with friends and strangers alike.`,
];

// Helper to pick a random quote from the array.
function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

// Type definition for bot racers.
interface Bot {
  name: string;
  progress: number; // number of characters typed
  wpm: number; // constant WPM target for the bot
}

// Type definition for aggregated racer data.
interface RacerInfo {
  name: string;
  progress: number;
  wpm: number;
}

// CarTrack renders the horizontal race track with cars for each racer.
function CarTrack({ racers, totalChars }: { racers: RacerInfo[]; totalChars: number }) {
  return (
    <div className="mt-6 space-y-4">
      {racers.map((r) => {
        const pct = totalChars === 0 ? 0 : (r.progress / totalChars) * 100;
        return (
          <div key={r.name} className="flex items-center space-x-2">
            <div className="w-24 text-right pr-2 text-sm font-medium text-gray-300">{r.name}</div>
            <div className="relative flex-1 h-8 bg-gray-700 rounded-full overflow-hidden">
              {/* Finish line: use a flag icon.  There is no FlagCheckered in lucide-react */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-1">
                <Flag size={20} className="text-green-400" />
              </div>
              {/* Car */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2"
                animate={{ x: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              >
                <Car size={24} className="text-yellow-400" />
              </motion.div>
            </div>
            <div className="w-12 text-left pl-2 text-sm text-gray-400">{Math.round(r.wpm)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  // Current quote to type.
  const [quote, setQuote] = useState<string>(() => randomQuote());
  // The text the player has typed so far.
  const [input, setInput] = useState('');
  // Whether the race is currently active.
  const [isRacing, setIsRacing] = useState(false);
  // Timestamp when the race started.
  const [startedAt, setStartedAt] = useState<number | null>(null);
  // Countdown state: null when no countdown, a number 3→1 or 'GO' during countdown.
  const [countdown, setCountdown] = useState<number | 'GO' | null>(null);
  // Bot racers with random WPM targets.
  const [bots, setBots] = useState<Bot[]>(() => [
    { name: 'Bot 1', progress: 0, wpm: 40 + Math.floor(Math.random() * 30) },
    { name: 'Bot 2', progress: 0, wpm: 40 + Math.floor(Math.random() * 30) },
  ]);
  // Ref to the input field for focusing when the race begins.
  const inputRef = useRef<HTMLInputElement>(null);

  // Player progress measured in characters typed (capped at quote length).
  const playerProgress = Math.min(input.length, quote.length);
  // Compute player WPM based on elapsed time and correct characters.
  const elapsedSeconds = startedAt ? (Date.now() - startedAt) / 1000 : 0;
  const wordsTyped = playerProgress / 5;
  const playerWPM = elapsedSeconds > 0 ? (wordsTyped * 60) / elapsedSeconds : 0;

  // Aggregate player and bots into a single array for rendering.
  const allRacers: RacerInfo[] = [
    { name: 'You', progress: playerProgress, wpm: playerWPM },
    ...bots.map((b) => ({ name: b.name, progress: b.progress, wpm: b.wpm })),
  ];

  // Update bot progress on a regular interval while racing.
  useEffect(() => {
    if (!isRacing) return;
    const interval = setInterval(() => {
      setBots((prevBots) =>
        prevBots.map((bot) => {
          // Convert WPM to characters per 0.5 seconds.
          const charsPerSecond = (bot.wpm * 5) / 60;
          const increment = charsPerSecond * 0.5;
          return {
            ...bot,
            progress: Math.min(bot.progress + increment, quote.length),
          };
        }),
      );
    }, 500);
    return () => clearInterval(interval);
  }, [isRacing, quote.length]);

  // End the race when the player reaches the end of the quote.
  useEffect(() => {
    if (isRacing && playerProgress >= quote.length) {
      setIsRacing(false);
    }
  }, [playerProgress, isRacing, quote.length]);

  // Handle input changes from the text field.
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value.length <= quote.length) {
      setInput(value);
    }
  }

  // Start a new race with a countdown.  Resets state.
  function startRace() {
    if (isRacing || countdown !== null) return;
    // Reset state for a new race.
    setInput('');
    setStartedAt(null);
    setBots([
      { name: 'Bot 1', progress: 0, wpm: 40 + Math.floor(Math.random() * 30) },
      { name: 'Bot 2', progress: 0, wpm: 40 + Math.floor(Math.random() * 30) },
    ]);
    setCountdown(3);
  }

  // Handle the countdown timer.  When it reaches 'GO', start the race.
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 'GO') {
      const to = setTimeout(() => {
        setCountdown(null);
        setIsRacing(true);
        setStartedAt(Date.now());
        // Focus the input after starting the race.
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }, 600);
      return () => clearTimeout(to);
    }
    const t = setTimeout(() => {
      setCountdown((c) => {
        if (c === null) return null;
        if (c === 1) return 'GO';
        return typeof c === 'number' ? c - 1 : null;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Pick a new random quote when requested.  Only allow while not racing.
  function newQuote() {
    if (isRacing || countdown !== null) return;
    setQuote(randomQuote());
    setInput('');
    setStartedAt(null);
    setBots([
      { name: 'Bot 1', progress: 0, wpm: 40 + Math.floor(Math.random() * 30) },
      { name: 'Bot 2', progress: 0, wpm: 40 + Math.floor(Math.random() * 30) },
    ]);
  }

  // Determine whether the race has finished for displaying final stats.
  const raceFinished = !isRacing && startedAt !== null && countdown === null;

  return (
    <div className="min-h-screen w-full px-4 py-6 md:p-8 max-w-5xl mx-auto">
      {/* Header with title and control buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-extrabold text-white">Typing Racer</h1>
        <div className="flex space-x-3">
          <Button onClick={startRace} disabled={isRacing || countdown !== null}>
            Start Race
          </Button>
          <Button onClick={newQuote} disabled={isRacing || countdown !== null} className="bg-gray-600 hover:bg-gray-500">
            New Quote
          </Button>
        </div>
      </div>

      {/* Prompt card */}
      <Card>
        <CardHeader>
          <CardTitle>Prompt</CardTitle>
          <CardDescription>Type the passage below as quickly and accurately as you can.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display the quote with coloured feedback and caret before next character */}
          <div className="font-mono whitespace-pre-wrap break-words text-lg leading-relaxed pb-4 border-b border-gray-700 mb-4">
            {quote.split('').map((ch, idx) => {
              let className = '';
              if (idx < input.length) {
                className = input[idx] === ch ? 'text-green-400' : 'text-red-400';
              } else if (idx === input.length && isRacing) {
                // Draw caret before next character.
                return (
                  <span key={idx} className="relative">
                    <span className="border-l-2 border-blue-400 animate-pulse absolute -left-1.5 h-6" />
                    <span className="text-gray-400">{ch}</span>
                  </span>
                );
              } else {
                className = 'text-gray-400';
              }
              return (
                <span key={idx} className={className}>
                  {ch}
                </span>
              );
            })}
          </div>
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Start typing..."
            disabled={!isRacing}
            className="font-mono text-lg"
          />
        </CardContent>
      </Card>

      {/* Race track view */}
      <CarTrack racers={allRacers} totalChars={quote.length} />

      {/* Stats card showing player progress and WPM */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-400">Words Per Minute (You)</div>
              <div className="text-2xl font-bold text-white">{Math.round(playerWPM) || 0}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-400">Progress</div>
              <Progress value={quote.length ? (playerProgress / quote.length) * 100 : 0} className="w-64" />
            </div>
            {raceFinished && (
              <div className="space-y-1">
                <div className="text-sm text-gray-400">Finished</div>
                <div className="text-2xl font-bold text-white">Well done!</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Countdown overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={String(countdown)}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 12 }}
              className="rounded-3xl border border-slate-700 bg-slate-900/80 px-12 py-8 shadow-2xl"
            >
              <div className="text-center">
                <div className="text-sm uppercase tracking-widest text-gray-400">Get Ready</div>
                <div className="mt-3 text-7xl font-extrabold text-white">
                  {countdown === 'GO' ? 'GO!' : countdown}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}