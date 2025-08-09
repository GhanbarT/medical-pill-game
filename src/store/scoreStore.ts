import {create} from 'zustand';

type ScoreState = {
    score: number;
    increase: (by?: number) => void;
    reset: () => void;
};

export const useScoreStore = create<ScoreState>((set) => ({
    score: 0,
    increase: (by = 1) => set((state) => ({ score: state.score + by })),
    reset: () => set({ score: 0 }),
}));
