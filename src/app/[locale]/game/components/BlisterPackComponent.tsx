'use client';
import { useTranslations } from 'next-intl';
import React from 'react';
import { BlisterPack } from '../lib/medicalData';
import BlisterSlot from './BlisterSlot';

type BlisterPackProps = {
  pack: BlisterPack;
  /* onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
   onDrop: (
     e: React.DragEvent<HTMLDivElement>,
     packId: number,
     slotId: number,
   ) => void;*/
  removePillFromSlot: (packId: number, slotId: number) => void;
  getColorClasses: (color: string) => string;
};

const BlisterPackComponent: React.FC<BlisterPackProps> = ({
  pack,
  /*onDragOver,
                                                            onDrop,*/
  removePillFromSlot,
  getColorClasses,
}: BlisterPackProps) => {
  const t = useTranslations('game');

  return (
    <div className="relative w-full">
      <div className="relative h-full overflow-hidden rounded-2xl border-2 border-gray-400 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-300 p-3 shadow-xl">
        <div className="relative z-10 mb-2 text-center">
          <div className="mb-1 text-xl">{pack.icon}</div>
          <h3 className="inline-block rounded-md border bg-white/90 px-2 py-1 text-xs font-bold text-gray-800 shadow-sm backdrop-blur-sm">
            {t(`conditions.${pack.condition}`)}
          </h3>
          <div className="mt-2 text-xs font-medium text-gray-700">
            {t('needs', {
              meds: pack.correctMeds.map((med) => t(`meds.${med}`)).join(' & '),
            })}
          </div>
        </div>
        <div className="relative z-10 space-y-2">
          {pack.slots.map((slot) => (
            <BlisterSlot
              key={slot.id}
              slot={slot}
              packId={pack.id}
              /*onDragOver={onDragOver}
              onDrop={onDrop}*/
              removePillFromSlot={removePillFromSlot}
              getColorClasses={getColorClasses}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlisterPackComponent;
