'use client';
import { HelpCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

type GameControlsProps = {
  score: number;
  gameCompleted: boolean;
  resetGame: () => void;
  openHowToPlay: () => void;
  hasOpenedHowToPlay: boolean;
};

const GameControls: React.FC<GameControlsProps> = ({
  score,
  gameCompleted,
  resetGame,
  openHowToPlay,
  hasOpenedHowToPlay,
}: GameControlsProps) => {
  const t = useTranslations('game');

  return (
    <div className="mb-4 text-center">
      {/* Instructions text */}
      <p className="mb-2 text-sm text-white/90 md:text-base">
        {t('instructions')}
      </p>

      {/* Controls row */}
      <div className="flex flex-row items-center justify-center gap-2">
        {/* Score display */}
        <div className="rounded-md bg-white/20 px-2 py-1 backdrop-blur-sm">
          <span className="text-sm font-bold text-white">
            {t('score', { score })}
          </span>
          {gameCompleted && (
            <div className="mt-0.5 text-xs text-green-200">
              {t('gameComplete')}
            </div>
          )}
        </div>

        {/* Reset button */}
        <button
          onClick={resetGame}
          className="rounded-md bg-white/20 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/30"
        >
          {t('reset')}
        </button>

        {/* How to Play button */}
        <button
          onClick={openHowToPlay}
          className={`rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/30 ${
            !hasOpenedHowToPlay ? 'animate-pulse' : ''
          }`}
          title={t('howToPlayTitle')}
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </div>
  );
};

export default GameControls;
