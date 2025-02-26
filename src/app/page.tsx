import {
  FavoriteCities,
  SearchBar,
  WeatherInfo,
  DailyTempForecast,
  HourlyForecast,
} from '@/components';

export default async function Home() {
  return (
    <main
      className="w-full flex flex-col items-center min-h-screen p-4 sm:p-10 bg-black"
      role="main"
      aria-label="Weather forecast application"
    >
      <h1
        className="flex flex-col text-center sm:flex-row gap-3 text-5xl tracking-wider mt-16"
        aria-label="Weather Forecast"
      >
        <span aria-hidden="true">🌍</span>{' '}
        <span className="bg-gradient-to-r from-orange-500 to-orange-300 text-transparent bg-clip-text">
          <b>Weather</b> Forecast
        </span>
      </h1>

      <section
        className="flex flex-col-reverse md:grid md:grid-cols-3"
        role="region"
        aria-label="Main weather information"
      >
        <div className="col-span-2 flex flex-col">
          <SearchBar />
          <WeatherInfo />
        </div>
        <FavoriteCities />
      </section>

      <section role="region" aria-label="Detailed weather forecasts">
        <HourlyForecast />
        <DailyTempForecast />
      </section>
    </main>
  );
}
