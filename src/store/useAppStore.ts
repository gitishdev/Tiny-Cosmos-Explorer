import { create } from 'zustand';
import * as THREE from 'three';

interface AppState {
  selectedBodyId: string | null;
  isMotionEnabled: boolean;
  showConstellations: boolean;
  viewLevel: 'galaxy' | 'solar-system' | 'planet';
  searchQuery: string;
  setSelectedBodyId: (id: string | null) => void;
  toggleMotion: () => void;
  toggleConstellations: () => void;
  setViewLevel: (level: 'galaxy' | 'solar-system' | 'planet') => void;
  setSearchQuery: (query: string) => void;
}

export const cameraTargetPosition = new THREE.Vector3(0, 0, 0);

export const useAppStore = create<AppState>((set) => ({
  selectedBodyId: null,
  isMotionEnabled: true,
  showConstellations: false,
  viewLevel: 'solar-system',
  searchQuery: '',
  setSelectedBodyId: (id) => set({ selectedBodyId: id, viewLevel: id ? 'planet' : 'solar-system' }),
  toggleMotion: () => set((state) => ({ isMotionEnabled: !state.isMotionEnabled })),
  toggleConstellations: () => set((state) => ({ showConstellations: !state.showConstellations })),
  setViewLevel: (level) => set({ viewLevel: level }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
