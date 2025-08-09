import {
  Dialog,
  DialogBackdrop,
  DialogHeader,
  DialogPanel,
  DialogTitle,
} from '@/components/animate-ui/headless/dialog';
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const HowToPlay: React.FC<HowToPlayProps> = ({
  translations: t,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onClose={() => onOpenChange(false)}>
      {/* Modal Content */}
      <DialogBackdrop />
      <DialogPanel className="border border-white/20 bg-white/10 text-white backdrop-blur-lg md:max-w-2xl lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {t.howToPlayTitle}
          </DialogTitle>
        </DialogHeader>
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
      </DialogPanel>
    </Dialog>
  );
};

export default HowToPlay;
