import { CitiesActions, CitiesState } from '@/lib/definitions/requests';
import { create } from 'zustand';

export const useCityStore = create<CitiesState & CitiesActions>((set) => ({
  units: 'metric',
  activeCity: null,
  favCities: [],
  setUnits: (units) => set(() => ({ units: units })),
  setActiveCity: (city) => set(() => ({ activeCity: city })),
  addFavCities: (cities) => set((state) => ({ favCities: [...state.favCities, ...cities] })),
  removeFavCity: (lat, lon) =>
    set((state) => ({
      favCities: state.favCities.filter((city) => city.lat !== lat && city.lon !== lon),
    })),
}));
