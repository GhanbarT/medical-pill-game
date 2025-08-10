'use client';

import { useDraggable } from '@dnd-kit/core';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Medication } from '../lib/medicalData';

type MedicationPillProps = {
  med: Medication;
  getColorClasses: (color: string) => string;
  isDragOverlay?: boolean;
};

const MedicationPill: React.FC<MedicationPillProps> = ({
  med,
  getColorClasses,
  isDragOverlay = false,
}: MedicationPillProps) => {
  const t = useTranslations('game');
  const colorClasses = getColorClasses(med.color);

  // draggable id is med-<id>
  const { listeners, setNodeRef, isDragging } = useDraggable({
    id: `med-${med.id}`,
    data: { med },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      className={`relative min-w-[90px] cursor-move rounded-full border border-white/30 px-2 py-1.5 text-center font-semibold text-white shadow-md transition-all duration-200 select-none ${
        !isDragOverlay && isDragging ? 'opacity-60' : ''
      }`}
      style={{
        background: `linear-gradient(145deg, ${colorClasses})`,
        touchAction: 'none',
      }}
      title={t('medDescription', {
        med: t(`meds.${med.name}`),
        category: t(`categories.${med.category}`),
      })}
    >
      <div className="text-[10px] font-bold md:text-xs">
        {t(`meds.${med.name}`)}
      </div>
      <div className="text-[10px] opacity-80 md:text-xs">
        {t(`categories.${med.category}`)}
      </div>
      <div className="absolute top-2.5 left-1.5 h-1.5 w-1.5 rounded-full bg-white/40"></div>
    </div>
  );
};

export default MedicationPill;
