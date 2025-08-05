import React from 'react';

type HowToPlayProps = {
  translations: {
    howToPlayTitle: string;
    scoringSystem: string;
    correctPlacement: string;
    wrongPlacement: string;
    removePill: string;
    instructionsTitle: string;
    instruction1: string;
    instruction2: string;
    instruction3: string;
    instruction4: string;
  };
};

const HowToPlay: React.FC<HowToPlayProps> = ({
  translations: t,
}: HowToPlayProps) => {
  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white/10 p-6 backdrop-blur-sm">
      <h3 className="mb-3 text-xl font-bold text-white">{t.howToPlayTitle}</h3>
      <div className="grid gap-6 text-white/90 md:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold text-green-200">
            {t.scoringSystem}
          </h4>
          <div className="space-y-1 text-sm">
            <p dangerouslySetInnerHTML={{ __html: t.correctPlacement }}></p>
            <p dangerouslySetInnerHTML={{ __html: t.wrongPlacement }}></p>
            <p dangerouslySetInnerHTML={{ __html: t.removePill }}></p>
          </div>
        </div>
        <div>
          <h4 className="mb-2 font-semibold text-blue-200">
            {t.instructionsTitle}
          </h4>
          <div className="space-y-1 text-sm">
            <p>{t.instruction1}</p>
            <p>{t.instruction2}</p>
            <p>{t.instruction3}</p>
            <p>{t.instruction4}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
