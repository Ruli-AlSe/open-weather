// import { searchCityLocation } from '@/actions/search-city-location';
import { SearchBar } from '@/components/search-bar';

export default async function Home() {
  // const cities = await searchCityLocation('salamanca');
  // console.log({ cities });
  return (
    <main className="w-full flex flex-col items-center min-h-screen p-8 sm:p-20">
      <h1 className="text-5xl tracking-wider">
        🌍 <b>Weather</b> Forecast
      </h1>

      <SearchBar />
    </main>
  );
}
