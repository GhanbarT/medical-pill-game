'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { toast } from 'sonner';
import BlisterPackComponent from './components/BlisterPackComponent';
import { GameControls } from './components/GameControls';
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

  const [score, setScore] = useState(0);
  const increaseScore = (amount: number) => setScore((prev) => prev + amount);

  const [medsList, setMedsList] = useState<Medication[]>(availableMeds);
  const [draggedItem, setDraggedItem] = useState<Medication | null>(null);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  const [blisterPacks, setBlisterPacks] = useState<BlisterPack[]>(
    medicalData.map((data, index) => ({
      id: index + 1,
      condition: data.condition,
      icon: data.icon,
      correctMeds: data.correctMeds,
      slots: [
        { id: index * 2 + 1, pill: null, isCorrect: null },
        { id: index * 2 + 2, pill: null, isCorrect: null },
      ],
    })),
  );

  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [hasOpenedHowToPlay, setHasOpenedHowToPlay] = useState(false);

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

  const showFeedback = (
    message: string,
    variant: 'success' | 'error' | 'warning' = 'success',
  ) => {
    toast[variant](message);
  };

  const checkGameCompletion = (updatedPacks: BlisterPack[]) => {
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
  ) => {
    e.preventDefault();
    if (!draggedItem) return;

    const targetPack = blisterPacks.find((pack) => pack.id === packId);
    const targetSlot = targetPack?.slots.find((slot) => slot.id === slotId);
    if (!targetPack || !targetSlot || targetSlot.pill !== null) {
      showFeedback(t('feedback.occupied'), 'warning');
      setDraggedItem(null);
      return;
    }

    const isCorrect = targetPack.correctMeds.includes(draggedItem.name);

    const updatedPacks = blisterPacks.map((pack) =>
      pack.id === packId
        ? {
            ...pack,
            slots: pack.slots.map((slot) =>
              slot.id === slotId
                ? { ...slot, pill: draggedItem, isCorrect }
                : slot,
            ),
          }
        : pack,
    );

    setBlisterPacks(updatedPacks);
    setTimeout(() => checkGameCompletion(updatedPacks), 100);

    // Remove the pill from available meds regardless of correctness
    setMedsList((prev) => prev.filter((m) => m.id !== draggedItem.id));

    if (isCorrect) {
      increaseScore(50);
      showFeedback(
        t('feedback.correct', {
          med: t(`meds.${draggedItem.name}`),
          condition: t(`conditions.${targetPack.condition}`),
        }),
        'success',
      );
    } else {
      increaseScore(-25);
      showFeedback(
        t('feedback.wrong', {
          med: t(`meds.${draggedItem.name}`),
          condition: t(`conditions.${targetPack.condition}`),
        }),
        'error',
      );
    }
    setDraggedItem(null);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    med: Medication,
  ) => {
    setDraggedItem(med);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const removePillFromSlot = (packId: number, slotId: number) => {
    let removedPill: Medication | null = null;
    const updatedPacks = blisterPacks.map((pack) => {
      if (pack.id !== packId) return pack;

      return {
        ...pack,
        slots: pack.slots.map((slot) => {
          if (slot.id === slotId && slot.pill) {
            removedPill = slot.pill; // store pill to add back later
            return { ...slot, pill: null, isCorrect: null };
          }
          return slot;
        }),
      };
    });

    const updatedMedsList = removedPill ? [...medsList, removedPill] : medsList;

    setBlisterPacks(updatedPacks);
    setMedsList(updatedMedsList);

    increaseScore(-10);
    setGameCompleted(false);
    showFeedback(t('feedback.removed'), 'warning');
  };
  const resetGame = () => {
    setBlisterPacks((prev) =>
      prev.map((pack) => ({
        ...pack,
        slots: pack.slots.map((slot) => ({
          ...slot,
          pill: null,
          isCorrect: null,
        })),
      })),
    );
    setMedsList(availableMeds);
    setScore(0);
    setGameCompleted(false);
  };

  const openHowToPlay = () => {
    setIsHowToPlayOpen(true);
    if (!hasOpenedHowToPlay) setHasOpenedHowToPlay(true);
  };

  const changeHowToPlayShow = (open: boolean) => {
    setIsHowToPlayOpen(open);
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <GameControls
          score={score}
          gameCompleted={gameCompleted}
          resetGame={resetGame}
          openHowToPlay={openHowToPlay}
          hasOpenedHowToPlay={hasOpenedHowToPlay}
        />

        {/* Medications */}
        <div className="mb-6">
          <h2 className="mb-4 text-center text-xl font-bold text-white md:text-2xl">
            {t('availableMeds')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            {medsList.map((med) => (
              <MedicationPill
                key={med.id}
                med={med}
                onDragStart={handleDragStart}
                getColorClasses={getColorClasses}
              />
            ))}
          </div>
        </div>

        {/* Blister Packs */}
        <div className="grid-auto mx-auto grid auto-rows-fr grid-cols-2 gap-6 gap-y-3 lg:grid-cols-4 lg:gap-4">
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

        {/* Instructions Modal */}
        <HowToPlay
          translations={howToPlayTranslations}
          open={isHowToPlayOpen}
          onOpenChange={changeHowToPlayShow}
        />
      </div>
    </div>
  );
};

export default MedicalPillGame;
