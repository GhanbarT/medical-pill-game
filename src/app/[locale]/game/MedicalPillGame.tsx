'use client';
import { usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react';

// Define TypeScript types
type MedicalCondition = {
  condition: string;
  correctMeds: string[];
  icon: string;
};

type MedicalData = Record<number, MedicalCondition>;

type Medication = {
  id: number;
  name: string;
  color: string;
  category: string;
};

type Slot = {
  id: number;
  pill: Medication | null;
  isCorrect: boolean | null;
};

type BlisterPack = {
  id: number;
  condition: string;
  icon: string;
  correctMeds: string[];
  slots: Slot[];
};

const MedicalPillGame: React.FC = () => {
  const t = useTranslations('game');
  const language = useLocale();
  const isRtl: boolean = language === 'fa';

  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (locale: string) => {
    console.log({ locale, pathname });
    if (locale == language) return;
    router.push(`/${locale}${pathname}`);
  };

  const [draggedItem, setDraggedItem] = useState<Medication | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');

  const medicalData: MedicalData = {
    1: {
      condition: 'Hypertension',
      correctMeds: ['Lisinopril', 'Amlodipine'],
      icon: '💗',
    },
    2: {
      condition: 'Diabetes',
      correctMeds: ['Metformin', 'Insulin'],
      icon: '🩸',
    },
    3: {
      condition: 'Depression',
      correctMeds: ['Sertraline', 'Fluoxetine'],
      icon: '🧠',
    },
    4: {
      condition: 'Asthma',
      correctMeds: ['Albuterol', 'Budesonide'],
      icon: '🫁',
    },
  };

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

  const availableMeds: Medication[] = [
    {
      id: 1,
      name: 'Lisinopril',
      color: 'bg-red-500',
      category: 'Hypertension',
    },
    {
      id: 2,
      name: 'Amlodipine',
      color: 'bg-pink-500',
      category: 'Hypertension',
    },
    { id: 3, name: 'Metformin', color: 'bg-blue-500', category: 'Diabetes' },
    { id: 4, name: 'Insulin', color: 'bg-cyan-500', category: 'Diabetes' },
    {
      id: 5,
      name: 'Sertraline',
      color: 'bg-purple-500',
      category: 'Depression',
    },
    {
      id: 6,
      name: 'Fluoxetine',
      color: 'bg-indigo-500',
      category: 'Depression',
    },
    { id: 7, name: 'Albuterol', color: 'bg-green-500', category: 'Asthma' },
    { id: 8, name: 'Budesonide', color: 'bg-emerald-500', category: 'Asthma' },
    {
      id: 9,
      name: 'Ibuprofen',
      color: 'bg-orange-500',
      category: 'Pain Relief',
    },
    {
      id: 10,
      name: 'Acetaminophen',
      color: 'bg-yellow-500',
      category: 'Pain Relief',
    },
  ];

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

  const showFeedback = (message: string, isPositive: boolean = true): void => {
    setFeedback(message);
    setTimeout(() => setFeedback(''), 2000);
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
        showFeedback(t('feedback.perfect'));
      } else {
        showFeedback(t('feedback.completed', { correct: correctPlacements }));
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
        showFeedback(t('feedback.occupied'), false);
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
        );
      } else {
        setScore((prevScore) => Math.max(0, prevScore - 25));
        showFeedback(
          t('feedback.wrong', {
            med: t(`meds.${draggedItem.name}`),
            condition: t(`conditions.${targetPack.condition}`),
          }),
          false,
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
    showFeedback(t('feedback.removed'), false);
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
    setFeedback('');
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
          {feedback && (
            <div
              className={`mt-4 rounded-lg p-3 backdrop-blur-sm ${
                feedback.includes('❌') ||
                feedback.includes(t('feedback.wrong')) ||
                feedback.includes(t('feedback.removed'))
                  ? 'bg-red-500/20 text-red-100'
                  : 'bg-green-500/20 text-green-100'
              }`}
            >
              {feedback}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-center text-xl font-bold text-white md:text-2xl">
            {t('availableMeds')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            {availableMeds.map((med) => (
              <div
                key={med.id}
                draggable
                onDragStart={(e) => handleDragStart(e, med)}
                className={`${med.color} relative transform cursor-move rounded-full border-2 border-white/30 px-3 py-2 font-semibold text-white shadow-lg transition-all duration-200 select-none hover:scale-105 hover:shadow-xl`}
                style={{
                  background: `linear-gradient(145deg, ${getColorClasses(med.color)})`,
                  minWidth: '120px',
                  textAlign: 'center',
                }}
                title={t('medDescription', {
                  med: t(`meds.${med.name}`),
                  category: t(`categories.${med.category}`),
                })}
              >
                <div className="text-xs font-bold md:text-sm">
                  {t(`meds.${med.name}`)}
                </div>
                <div className="text-xs opacity-80">
                  {t(`categories.${med.category}`)}
                </div>
                <div className="absolute top-1 left-1 h-2 w-2 rounded-full bg-white/40"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
          {blisterPacks.map((pack) => (
            <div key={pack.id} className="relative w-64">
              <div
                className="relative overflow-hidden rounded-2xl border-2 border-gray-400 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 p-4 shadow-xl"
                style={{
                  background: 'linear-gradient(145deg, #f3f4f6, #e5e7eb)',
                  boxShadow:
                    '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
                <div className="pointer-events-none absolute top-0 left-0 h-full w-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="relative z-10 mb-4 text-center">
                  <div className="mb-2 text-2xl">{pack.icon}</div>
                  <h3 className="inline-block rounded-lg border bg-white/90 px-3 py-2 text-sm font-bold text-gray-800 shadow-sm backdrop-blur-sm">
                    {t(`conditions.${pack.condition}`)}
                  </h3>
                  <div className="mt-2 text-xs font-medium text-gray-700">
                    {t('needs', {
                      meds: pack.correctMeds
                        .map((med) => t(`meds.${med}`))
                        .join(' & '),
                    })}
                  </div>
                </div>
                <div className="relative z-10 space-y-3">
                  {pack.slots.map((slot) => (
                    <div
                      key={slot.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, pack.id, slot.id)}
                      className="flex justify-center"
                    >
                      <div
                        className={`relative flex h-14 w-48 items-center justify-center rounded-2xl border-2 transition-all duration-200 ${
                          slot.pill === null
                            ? 'border-gray-500 bg-gradient-to-b from-gray-50 to-gray-200 shadow-inner hover:border-blue-400 hover:from-blue-50 hover:to-blue-200'
                            : slot.isCorrect === true
                              ? 'border-green-500 bg-gradient-to-b from-green-50 to-green-200 shadow-inner'
                              : 'border-red-500 bg-gradient-to-b from-red-50 to-red-200 shadow-inner'
                        }`}
                        style={{
                          boxShadow:
                            slot.pill === null
                              ? 'inset 0 3px 8px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(255,255,255,0.8)'
                              : 'inset 0 2px 6px rgba(0,0,0,0.15), inset 0 -1px 2px rgba(255,255,255,0.6)',
                        }}
                      >
                        <div className="pointer-events-none absolute inset-1 rounded-xl bg-gradient-to-b from-white/30 to-transparent"></div>
                        {slot.pill === null && (
                          <div className="flex items-center text-xs font-medium text-gray-500">
                            <div className="mr-2 h-2 w-2 rounded-full bg-gray-400"></div>
                            {t('dropHere')}
                          </div>
                        )}
                        {slot.pill && (
                          <div
                            onClick={() => removePillFromSlot(pack.id, slot.id)}
                            className={`${slot.pill.color} relative cursor-pointer rounded-full border border-white/40 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:scale-105 hover:opacity-80`}
                            style={{
                              background: `linear-gradient(145deg, ${getColorClasses(slot.pill.color)})`,
                              boxShadow:
                                'inset 0 2px 4px rgba(255,255,255,0.3), 0 3px 8px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
                              minWidth: '120px',
                            }}
                            title={t('removeTitle')}
                          >
                            <div className="flex items-center justify-center">
                              {t(`meds.${slot.pill.name}`)}
                              {slot.isCorrect === true && (
                                <span className="ml-2">✅</span>
                              )}
                              {slot.isCorrect === false && (
                                <span className="ml-2">❌</span>
                              )}
                            </div>
                            <div className="absolute top-0.5 left-2 h-1.5 w-1.5 rounded-full bg-white/50"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white/95 shadow-md">
                  <span className="text-xs font-bold text-gray-800">
                    {pack.slots.filter((slot) => slot.pill !== null).length}/2
                  </span>
                </div>
                <div className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-400 bg-green-500/95 shadow-md">
                  <span className="text-xs font-bold text-white">
                    {
                      pack.slots.filter((slot) => slot.isCorrect === true)
                        .length
                    }
                    ✓
                  </span>
                </div>
                <div className="absolute right-4 bottom-0 left-4 h-px bg-gray-400 opacity-50"></div>
                <div className="absolute right-4 bottom-0 left-4 flex justify-between">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1 w-1 translate-y-0.5 transform rounded-full bg-gray-400"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="mx-auto max-w-4xl rounded-xl bg-white/10 p-6 backdrop-blur-sm">
            <h3 className="mb-3 text-xl font-bold text-white">
              {t('howToPlayTitle')}
            </h3>
            <div className="grid gap-6 text-white/90 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-green-200">
                  {t('scoringSystem')}
                </h4>
                <div className="space-y-1 text-sm">
                  <p
                    dangerouslySetInnerHTML={{ __html: t('correctPlacement') }}
                  ></p>
                  <p
                    dangerouslySetInnerHTML={{ __html: t('wrongPlacement') }}
                  ></p>
                  <p dangerouslySetInnerHTML={{ __html: t('removePill') }}></p>
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-blue-200">
                  {t('instructionsTitle')}
                </h4>
                <div className="space-y-1 text-sm">
                  <p>{t('instruction1')}</p>
                  <p>{t('instruction2')}</p>
                  <p>{t('instruction3')}</p>
                  <p>{t('instruction4')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => changeLanguage('en')}
            className="mr-2 rounded bg-white/20 px-4 py-2 text-white"
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('fa')}
            className="rounded bg-white/20 px-4 py-2 text-white"
          >
            Persian
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalPillGame;
