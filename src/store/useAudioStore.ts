import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  currentSurah: any | null;
  currentAyah: number | null;
  currentReciter: string;
  volume: number;
  isRepeat: boolean;
  isShuffle: boolean;
  
  // Actions
  setIsPlaying: (playing: boolean) => void;
  setCurrentSurah: (surah: any) => void;
  setCurrentAyah: (ayah: number | null) => void;
  setCurrentReciter: (reciter: string) => void;
  setVolume: (volume: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  currentSurah: null,
  currentAyah: null,
  currentReciter: '7', // Default reciter (Mishary Alafasy for Quran Foundation v4)
  volume: 0.8,
  isRepeat: false,
  isShuffle: false,

  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentSurah: (surah) => set({ currentSurah: surah }),
  setCurrentAyah: (ayah) => set({ currentAyah: ayah }),
  setCurrentReciter: (reciter) => set({ currentReciter: reciter }),
  setVolume: (volume) => set({ volume }),
  toggleRepeat: () => set((state) => ({ isRepeat: !state.isRepeat })),
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),
}));
