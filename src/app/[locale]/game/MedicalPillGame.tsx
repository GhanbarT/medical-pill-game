'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers';
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
  const [activeMed, setActiveMed] = useState<Medication | null>(null);
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 50, tolerance: 5 },
    }),
    useSensor(KeyboardSensor),
  );

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
      if (correctPlacements === updatedPacks.length * 2) {
        showFeedback(t('feedback.perfect'), 'success');
      } else {
        showFeedback(
          t('feedback.completed', { correct: correctPlacements }),
          'success',
        );
      }
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id as string;
    if (id && id.startsWith('med-')) {
      const numericId = Number(id.replace('med-', ''));
      const med = medsList.find((m) => m.id === numericId) || null;
      setActiveMed(med);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log({ active, over });
    setActiveMed(null);

    if (!over) {
      return;
    }

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);

    // Only handle med -> slot drops
    if (!activeIdStr.startsWith('med-') || !overIdStr.startsWith('slot-')) {
      return;
    }

    const medNumericId = Number(activeIdStr.replace('med-', ''));
    const med = medsList.find((m) => m.id === medNumericId);
    if (!med) {
      // maybe already removed (rare)
      return;
    }

    // parse slot id: slot-<packId>-<slotId>
    const [, packPart, slotPart] = overIdStr.split('-');
    const packIdNum = Number(packPart);
    const slotIdNum = Number(slotPart);

    const targetPack = blisterPacks.find((p) => p.id === packIdNum);
    const targetSlot = targetPack?.slots.find((s) => s.id === slotIdNum);

    if (!targetPack || !targetSlot) {
      return;
    }

    if (targetSlot.pill !== null) {
      showFeedback(t('feedback.occupied'), 'warning');
      return;
    }

    // compute updated packs and meds list first (no setState inside maps)
    const isCorrect = targetPack.correctMeds.includes(med.name);
    const updatedPacks = blisterPacks.map((p) =>
      p.id === packIdNum
        ? {
            ...p,
            slots: p.slots.map((s) =>
              s.id === slotIdNum ? { ...s, pill: med, isCorrect } : s,
            ),
          }
        : p,
    );

    const updatedMedsList = medsList.filter((x) => x.id !== med.id);

    setBlisterPacks(updatedPacks);
    setMedsList(updatedMedsList);

    setTimeout(() => checkGameCompletion(updatedPacks), 100);

    if (isCorrect) {
      increaseScore(50);
      showFeedback(
        t('feedback.correct', {
          med: t(`meds.${med.name}`),
          condition: t(`conditions.${targetPack.condition}`),
        }),
        'success',
      );
    } else {
      increaseScore(-25);
      showFeedback(
        t('feedback.wrong', {
          med: t(`meds.${med.name}`),
          condition: t(`conditions.${targetPack.condition}`),
        }),
        'error',
      );
    }
  };

  const removePillFromSlot = (packIdNum: number, slotIdNum: number) => {
    // compute updated packs & meds list first
    let removedPill: Medication | null = null;

    const updatedPacks = blisterPacks.map((p) => {
      if (p.id !== packIdNum) return p;
      return {
        ...p,
        slots: p.slots.map((s) => {
          if (s.id === slotIdNum && s.pill) {
            removedPill = s.pill;
            return { ...s, pill: null, isCorrect: null };
          }
          return s;
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
    const cleared = blisterPacks.map((pack) => ({
      ...pack,
      slots: pack.slots.map((slot) => ({
        ...slot,
        pill: null,
        isCorrect: null,
      })),
    }));
    setBlisterPacks(cleared);
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

  const renderDragOverlay = () => {
    if (!activeMed) return null;
    return (
      <MedicationPill
        med={activeMed}
        getColorClasses={getColorClasses}
        isDragOverlay
      />
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[snapCenterToCursor, restrictToWindowEdges]}
        >
          <GameControls
            score={score}
            gameCompleted={gameCompleted}
            resetGame={resetGame}
            openHowToPlay={openHowToPlay}
            hasOpenedHowToPlay={hasOpenedHowToPlay}
          />

          {/* Available meds: draggable sources */}
          <div className="mb-6">
            <h2 className="mb-4 text-center text-xl font-bold text-white md:text-2xl">
              {t('availableMeds')}
            </h2>
            <div className="flex flex-wrap justify-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              {medsList.map((med) => (
                <MedicationPill
                  key={med.id}
                  med={med}
                  getColorClasses={getColorClasses}
                />
              ))}
            </div>
          </div>
          <DragOverlay adjustScale={false} zIndex={999999}>
            {renderDragOverlay()}
          </DragOverlay>

          {/* Blister Packs */}
          <div className="grid-auto mx-auto grid auto-rows-fr grid-cols-2 gap-6 gap-y-3 lg:grid-cols-4 lg:gap-4">
            {blisterPacks.map((pack) => (
              <BlisterPackComponent
                key={pack.id}
                pack={pack}
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
        </DndContext>
      </div>
    </div>
  );
};

export default MedicalPillGame;
