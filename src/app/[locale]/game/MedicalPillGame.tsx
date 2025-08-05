'use client';
import { usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import BlisterPackComponent from './components/BlisterPackComponent';
import HowToPlay from './components/HowToPlay';
import MedicationPill from './components/MedicationPill';
import {
  availableMeds,
  BlisterPack,
  medicalData,
  Medication,
} from './lib/medicalData';

const MedicalPillGame: React.FC = () => {
  const t = useTranslations('game');
  const language = useLocale();
  const isRtl: boolean = language === 'fa';
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (locale: string) => {
    if (locale === language) return;
    router.push(`/${locale}${pathname}`);
  };

  const [draggedItem, setDraggedItem] = useState<Medication | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  const [blisterPacks, setBlisterPacks] = useState<BlisterPack[]>([
    {
      id: 1,
      condition: medicalData[1].condition,
      icon: medicalData[1].icon,
      correctMeds: medicalData[1].correctMeds,
      slots: [
        { id: 1, pill: null, isCorrect: null },
        { id: 2, pill: null, isCorrect: null },
      ],
    },
    {
      id: 2,
      condition: medicalData[2].condition,
      icon: medicalData[2].icon,
      correctMeds: medicalData[2].correctMeds,
      slots: [
        { id: 3, pill: null, isCorrect: null },
        { id: 4, pill: null, isCorrect: null },
      ],
    },
    {
      id: 3,
      condition: medicalData[3].condition,
      icon: medicalData[3].icon,
      correctMeds: medicalData[3].correctMeds,
      slots: [
        { id: 5, pill: null, isCorrect: null },
        { id: 6, pill: null, isCorrect: null },
      ],
    },
    {
      id: 4,
      condition: medicalData[4].condition,
      icon: medicalData[4].icon,
      correctMeds: medicalData[4].correctMeds,
      slots: [
        { id: 7, pill: null, isCorrect: null },
        { id: 8, pill: null, isCorrect: null },
      ],
    },
  ]);

  const getColorClasses = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      'bg-red-500': '#ef4444, #dc2626',
      'bg-pink-500': '#ec4899, #db2777',
      'bg-blue-500': '#3b82f6, #2563eb',
      'bg-cyan-500': '#06b6d4, #0891b2',
      'bg-purple-500': '#a855f7, #9333ea',
      'bg-indigo-500': '#6366f1, #4f46e5',
      'bg-green-500': '#10b981, #059669',
      'bg-emerald-500': '#10b981, #047857',
      'bg-orange-500': '#f97316, #ea580c',
      'bg-yellow-500': '#eab308, #ca8a04',
    };
    return colorMap[color] || '#6b7280, #4b5563';
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    med: Medication,
  ): void => {
    setDraggedItem(med);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const showFeedback = (
    message: string,
    variant: 'success' | 'error' | 'warning' = 'success',
  ): void => {
    switch (variant) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
    }
  };

  const checkGameCompletion = (updatedPacks: BlisterPack[]): void => {
    const allSlotsFilled = updatedPacks.every((pack) =>
      pack.slots.every((slot) => slot.pill !== null),
    );
    if (allSlotsFilled) {
      const correctPlacements = updatedPacks.reduce(
        (total, pack) =>
          total + pack.slots.filter((slot) => slot.isCorrect === true).length,
        0,
      );
      setGameCompleted(true);
      if (correctPlacements === 8) {
        showFeedback(t('feedback.perfect'), 'success');
      } else {
        showFeedback(
          t('feedback.completed', { correct: correctPlacements }),
          'success',
        );
      }
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    packId: number,
    slotId: number,
  ): void => {
    e.preventDefault();
    if (draggedItem) {
      const targetPack = blisterPacks.find((pack) => pack.id === packId);
      if (!targetPack) return;
      const targetSlot = targetPack.slots.find((slot) => slot.id === slotId);
      if (!targetSlot) return;

      if (targetSlot.pill !== null) {
        showFeedback(t('feedback.occupied'), 'warning');
        setDraggedItem(null);
        return;
      }

      const isCorrectMed = targetPack.correctMeds.includes(draggedItem.name);
      setBlisterPacks((prevPacks) => {
        const updatedPacks = prevPacks.map((pack) =>
          pack.id === packId
            ? {
                ...pack,
                slots: pack.slots.map((slot) =>
                  slot.id === slotId
                    ? { ...slot, pill: draggedItem, isCorrect: isCorrectMed }
                    : slot,
                ),
              }
            : pack,
        );
        setTimeout(() => checkGameCompletion(updatedPacks), 100);
        return updatedPacks;
      });

      if (isCorrectMed) {
        setScore((prevScore) => prevScore + 50);
        showFeedback(
          t('feedback.correct', {
            med: t(`meds.${draggedItem.name}`),
            condition: t(`conditions.${targetPack.condition}`),
          }),
          'success',
        );
      } else {
        setScore((prevScore) => Math.max(0, prevScore - 25));
        showFeedback(
          t('feedback.wrong', {
            med: t(`meds.${draggedItem.name}`),
            condition: t(`conditions.${targetPack.condition}`),
          }),
          'error',
        );
      }
      setDraggedItem(null);
    }
  };

  const removePillFromSlot = (packId: number, slotId: number): void => {
    setBlisterPacks((prevPacks) =>
      prevPacks.map((pack) =>
        pack.id === packId
          ? {
              ...pack,
              slots: pack.slots.map((slot) =>
                slot.id === slotId
                  ? { ...slot, pill: null, isCorrect: null }
                  : slot,
              ),
            }
          : pack,
      ),
    );
    setScore((prevScore) => Math.max(0, prevScore - 10));
    setGameCompleted(false);
    showFeedback(t('feedback.removed'), 'warning');
  };

  const resetGame = (): void => {
    setBlisterPacks(
      blisterPacks.map((pack) => ({
        ...pack,
        slots: pack.slots.map((slot) => ({
          ...slot,
          pill: null,
          isCorrect: null,
        })),
      })),
    );
    setScore(0);
    setGameCompleted(false);
  };

  const howToPlayTranslations = {
    howToPlayTitle: t('howToPlayTitle'),
    scoringSystem: t('scoringSystem'),
    correctPlacement: t('correctPlacement'),
    wrongPlacement: t('wrongPlacement'),
    removePill: t('removePill'),
    instructionsTitle: t('instructionsTitle'),
    instruction1: t('instruction1'),
    instruction2: t('instruction2'),
    instruction3: t('instruction3'),
    instruction4: t('instruction4'),
  };

  return (
    <div
      className={`min-h-screen ${isRtl ? 'rtl' : 'ltr'} bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 p-4`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <h1 className="mb-3 text-3xl font-bold text-white drop-shadow-lg md:text-4xl">
            🏥 {t('title')} 💊
          </h1>
          <p className="mb-4 text-lg text-white/90 md:text-xl">
            {t('instructions')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="rounded-lg bg-white/20 px-6 py-3 backdrop-blur-sm">
              <span className="text-xl font-bold text-white md:text-2xl">
                {t('score', { score })}
              </span>
              {gameCompleted && (
                <div className="mt-1 text-sm text-green-200">
                  {t('gameComplete')}
                </div>
              )}
            </div>
            <button
              onClick={resetGame}
              className="rounded-lg bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white/30"
            >
              {t('reset')}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-center text-xl font-bold text-white md:text-2xl">
            {t('availableMeds')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            {availableMeds.map((med) => (
              <MedicationPill
                key={med.id}
                med={med}
                onDragStart={handleDragStart}
                getColorClasses={getColorClasses}
              />
            ))}
          </div>
        </div>

        <div className="grid-auto mx-auto grid auto-rows-fr grid-cols-2 gap-6 lg:grid-cols-4">
          {blisterPacks.map((pack) => (
            <BlisterPackComponent
              key={pack.id}
              pack={pack}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              removePillFromSlot={removePillFromSlot}
              getColorClasses={getColorClasses}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <HowToPlay translations={howToPlayTranslations} />
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={() => changeLanguage('en')}
            className="rounded bg-white/20 px-4 py-2 text-white"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('fa')}
            className="rounded bg-white/20 px-4 py-2 text-white"
          >
            فارسی
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalPillGame;
