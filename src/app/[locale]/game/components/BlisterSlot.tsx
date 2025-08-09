'use client';
import { Slot } from '@/app/[locale]/game/lib/medicalData';
import { useTranslations } from 'next-intl';
import React from 'react';

type BlisterSlotProps = {
  slot: Slot;
  packId: number;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (
    e: React.DragEvent<HTMLDivElement>,
    packId: number,
    slotId: number,
  ) => void;
  removePillFromSlot: (packId: number, slotId: number) => void;
  getColorClasses: (color: string) => string;
};

const BlisterSlot: React.FC<BlisterSlotProps> = ({
  slot,
  packId,
  onDragOver,
  onDrop,
  removePillFromSlot,
  getColorClasses,
}: BlisterSlotProps) => {
  const t = useTranslations('game');
  const colorClasses = slot.pill ? getColorClasses(slot.pill.color) : '';

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, packId, slot.id)}
      className="flex justify-center"
    >
      <div
        className={`relative flex h-12 w-48 items-center justify-center rounded-2xl border-2 transition-all duration-200 ${
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
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <div className="mr-2 h-2 w-2 rounded-full bg-gray-400"></div>
            {t('dropHere')}
          </div>
        )}
        {slot.pill && (
          <div
            onClick={() => removePillFromSlot(packId, slot.id)}
            className={`${slot.pill.color} relative cursor-pointer rounded-full border border-white/40 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:scale-105 hover:opacity-80`}
            style={{
              background: `linear-gradient(145deg, ${colorClasses})`,
              boxShadow:
                'inset 0 2px 4px rgba(255,255,255,0.3), 0 3px 8px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
              minWidth: '120px',
            }}
            title={t('removeTitle')}
          >
            <div className="flex items-center justify-center">
              {t(`meds.${slot.pill.name}`)}
              {slot.isCorrect === true && <span className="ml-2">✅</span>}
              {slot.isCorrect === false && <span className="ml-2">❌</span>}
            </div>
            <div className="absolute top-1 left-2 h-1.5 w-1.5 rounded-full bg-white/50"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlisterSlot;
