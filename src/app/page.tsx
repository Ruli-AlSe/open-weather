import {
  FavoriteCities,
  SearchBar,
  WeatherInfo,
  DailyTempForecast,
  HourlyForecast,
} from '@/components';

export default async function Home() {
  return (
    <main className="w-full flex flex-col items-center min-h-screen p-4 sm:p-20 bg-black">
      <h1 className="flex flex-col text-center sm:flex-row gap-3 text-5xl tracking-wider mt-16">
        🌍{' '}
        <span className="bg-gradient-to-r from-red-600 to-red-300 text-transparent bg-clip-text">
          <b>Weather</b> Forecast
        </span>
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-3">
        <SearchBar />
        <FavoriteCities />
      </section>
      <WeatherInfo />

      <HourlyForecast />
      <DailyTempForecast />
    </main>
  );
}
