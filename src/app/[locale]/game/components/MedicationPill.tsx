'use client';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Medication } from '../lib/medicalData';

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
      draggable="true"
      onDragStart={(e) => onDragStart(e, med)}
      className={`${med.color} relative transform cursor-move rounded-full border border-white/30 px-2 py-1.5 font-semibold text-white shadow-md transition-all duration-200 select-none hover:scale-105 hover:shadow-lg`}
      style={{
        background: `linear-gradient(145deg, ${colorClasses})`,
        minWidth: '90px',
        textAlign: 'center',
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
