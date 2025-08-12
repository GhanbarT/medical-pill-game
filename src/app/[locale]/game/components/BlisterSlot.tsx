'use client';

import { Slot } from '@/app/[locale]/game/lib/medicalData';
import { useDroppable } from '@dnd-kit/core';
import { useTranslations } from 'next-intl';
import React from 'react';

type BlisterSlotProps = {
  slot: Slot;
  packId: number;
  removePillFromSlot: (packId: number, slotId: number) => void;
  getColorClasses: (color: string) => string;
};

const BlisterSlot: React.FC<BlisterSlotProps> = ({
  slot,
  packId,
  removePillFromSlot,
  getColorClasses,
}: BlisterSlotProps) => {
  const t = useTranslations('game');

  const id = `slot-${packId}-${slot.id}`;
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { slotId: slot.id, packId },
  });

  const colorClasses = slot.pill ? getColorClasses(slot.pill.color) : '';

  const emptyCls =
    'border-gray-500 bg-gradient-to-b from-gray-50 to-gray-200 shadow-inner hover:border-blue-400 hover:from-blue-50 hover:to-blue-200';
  const correctCls =
    'border-green-500 bg-gradient-to-b from-green-50 to-green-200 shadow-inner';
  const wrongCls =
    'border-red-500 bg-gradient-to-b from-red-50 to-red-200 shadow-inner';

  const baseShadow =
    slot.pill === null
      ? 'inset 0 3px 8px rgba(0,0,0,0.12), inset 0 -2px 4px rgba(255,255,255,0.8)'
      : 'inset 0 2px 6px rgba(0,0,0,0.12)';

  return (
    <div ref={setNodeRef} className="flex justify-center">
      <div
        className={`relative flex h-10 w-44 items-center justify-center rounded-xl border-2 transition-all duration-200 ${
          slot.pill === null
            ? emptyCls
            : slot.isCorrect === true
              ? correctCls
              : wrongCls
        }`}
        style={{
          boxShadow:
            isOver && slot.pill === null
              ? `${baseShadow}, 0 0 0 2px #93c5fd` // blue-300 ring
              : baseShadow,
        }}
      >
        <div className="pointer-events-none absolute inset-1 rounded-xl bg-gradient-to-b from-white/30 to-transparent"></div>

        {slot.pill === null ? (
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <div className="mr-2 h-2 w-2 rounded-full bg-gray-400"></div>
            {t('dropHere')}
          </div>
        ) : (
          <div
            onClick={() => removePillFromSlot(packId, slot.id)}
            className={`${slot.pill.color} relative cursor-pointer rounded-full border border-white/40 px-3 py-1.5 text-xs font-bold text-white transition-all duration-200 hover:scale-105 hover:opacity-90`}
            style={{
              background: `linear-gradient(145deg, ${colorClasses})`,
              minWidth: '100px',
              boxShadow:
                'inset 0 2px 4px rgba(255,255,255,0.28), 0 3px 8px rgba(0,0,0,0.12)',
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
