import { create } from 'zustand';
import { Pet } from '../types/pet';

interface PetState {
  pets: Pet[];
  currentPet: Pet | null;
  loadPets: () => Promise<void>;
  setCurrentPet: (pet: Pet) => void;
  createPet: (pet: Pet) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  currentPet: null,

  loadPets: async () => {
    try {
      const pets = await (window as any).api.getPets();
      set((state) => ({
        ...state,
        pets,
        currentPet: pets[0] || null,
      }));
    } catch (error) {
      console.error('Failed to load pets:', error);
    }
  },

  setCurrentPet: (pet: Pet) => {
    set({ currentPet: pet });
  },

  createPet: async (pet: Pet) => {
    try {
      await (window as any).api.savePet(pet);
      set((state) => ({
        pets: [...state.pets, pet],
        currentPet: pet,
      }));
    } catch (error) {
      console.error('Failed to create pet:', error);
    }
  },

  deletePet: async (petId: string) => {
    try {
      await (window as any).api.deletePet(petId);
      set((state) => ({
        pets: state.pets.filter((p) => p.id !== petId),
        currentPet: state.currentPet?.id === petId ? null : state.currentPet,
      }));
    } catch (error) {
      console.error('Failed to delete pet:', error);
    }
  },
}));
