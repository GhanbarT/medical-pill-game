'use client';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Medication } from './medicalData';

type MedicationPillProps = {
  med: Medication;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, med: Medication) => void;
  getColorClasses: (color: string) => string;
};

const MedicationPill: React.FC<MedicationPillProps> = ({
  med,
  onDragStart,
  getColorClasses,
}: MedicationPillProps) => {
  const t = useTranslations('game');
  const colorClasses = getColorClasses(med.color);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, med)}
      className={`${med.color} relative transform cursor-move rounded-full border-2 border-white/30 px-3 py-2 font-semibold text-white shadow-lg transition-all duration-200 select-none hover:scale-105 hover:shadow-xl`}
      style={{
        background: `linear-gradient(145deg, ${colorClasses})`,
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
  );
};

export default MedicationPill;
