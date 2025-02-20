import { SearchBar, WeatherInfo } from '@/components';

export default async function Home() {
  return (
    <main className="w-full flex flex-col items-center min-h-screen p-4 sm:p-20">
      <h1 className="flex flex-col text-center sm:flex-row gap-3 text-5xl tracking-wider mt-16">
        🌍{' '}
        <span>
          <b>Weather</b> Forecast
        </span>
      </h1>

      <SearchBar />
      <WeatherInfo />
    </main>
  );
}
