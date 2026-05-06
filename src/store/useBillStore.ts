import { create } from 'zustand';

interface BillItem {
  id: string;
  name: string;
  amount: number;
}

interface Member {
  id: string;
  displayName: string;
  pictureUrl?: string;
}

interface BillState {
  step: number;
  title: string;
  items: BillItem[];
  members: Member[];
  splitType: 'equal' | 'each';
  
  // Actions
  setStep: (step: number) => void;
  setTitle: (title: string) => void;
  addItem: (name: string, amount: number) => void;
  removeItem: (id: string) => void;
  addMember: (member: Member) => void;
  removeMember: (id: string) => void;
  setSplitType: (type: 'equal' | 'each') => void;
  reset: () => void;
}

export const useBillStore = create<BillState>((set) => ({
  step: 1,
  title: '',
  items: [],
  members: [],
  splitType: 'equal',

  setStep: (step) => set({ step }),
  setTitle: (title) => set({ title }),
  addItem: (name, amount) => set((state) => ({
    items: [...state.items, { id: Math.random().toString(36).substr(2, 9), name, amount }]
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
  addMember: (member) => set((state) => ({
    members: state.members.find(m => m.id === member.id) ? state.members : [...state.members, member]
  })),
  removeMember: (id) => set((state) => ({
    members: state.members.filter((m) => m.id !== id)
  })),
  setSplitType: (type) => set({ splitType: type }),
  reset: () => set({ step: 1, title: '', items: [], members: [], splitType: 'equal' }),
}));
