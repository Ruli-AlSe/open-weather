import { CitiesActions, CitiesState } from '@/lib/definitions';
import { create } from 'zustand';

export const useCityStore = create<CitiesState & CitiesActions>((set) => ({
  activeCity: null,
  favCities: [],
  setActiveCity: (city) => set(() => ({ activeCity: city })),
  addFavCities: (cities) => set((state) => ({ favCities: [...state.favCities, ...cities] })),
  removeFavCity: (lat, lon) =>
    set((state) => ({
      favCities: state.favCities.filter((city) => city.lat !== lat && city.lon !== lon),
    })),
}));
