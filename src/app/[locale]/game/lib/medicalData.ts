export type MedicalCondition = {
  condition: string;
  correctMeds: string[];
  icon: string;
};

export type MedicalData = Record<number, MedicalCondition>;

export type Medication = {
  id: number;
  name: string;
  color: string;
  category: string;
};

export type Slot = {
  id: number;
  pill: Medication | null;
  isCorrect: boolean | null;
};

export type BlisterPack = {
  id: number;
  condition: string;
  icon: string;
  correctMeds: string[];
  slots: Slot[];
};

export const medicalData: MedicalData = {
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

export const availableMeds: Medication[] = [
  { id: 1, name: 'Lisinopril', color: 'bg-red-500', category: 'Hypertension' },
  { id: 2, name: 'Amlodipine', color: 'bg-pink-500', category: 'Hypertension' },
  { id: 3, name: 'Metformin', color: 'bg-blue-500', category: 'Diabetes' },
  { id: 4, name: 'Insulin', color: 'bg-cyan-500', category: 'Diabetes' },
  { id: 5, name: 'Sertraline', color: 'bg-purple-500', category: 'Depression' },
  { id: 6, name: 'Fluoxetine', color: 'bg-indigo-500', category: 'Depression' },
  { id: 7, name: 'Albuterol', color: 'bg-green-500', category: 'Asthma' },
  { id: 8, name: 'Budesonide', color: 'bg-emerald-500', category: 'Asthma' },
  { id: 9, name: 'Ibuprofen', color: 'bg-orange-500', category: 'Pain Relief' },
  {
    id: 10,
    name: 'Acetaminophen',
    color: 'bg-yellow-500',
    category: 'Pain Relief',
  },
];
