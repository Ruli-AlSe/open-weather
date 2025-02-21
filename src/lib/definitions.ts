export interface City {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface CitiesState {
  activeCity: City | null;
  favCities: City[];
}

export interface CitiesActions {
  setActiveCity: (city: City | null) => void;
  addFavCities: (cities: City[]) => void;
  removeFavCity: (lat: number, lon: number) => void;
}

export interface Climate {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Environment;
  visibility: number;
  wind: Wind;
  clouds: Cloudiness;
  dt: number;
  timezone: number;
  id: number;
  name: string;
}

export interface Cloudiness {
  all: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface Environment {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface Forecast {
  dt: number;
  main: Environment;
  weather: Weather[];
  clouds: Cloudiness;
  pop: number;
  dt_txt: string;
}

export interface TempForecast {
  temp_max?: number;
  temp_min?: number;
  temp?: number;
  dt_txt: string;
}
