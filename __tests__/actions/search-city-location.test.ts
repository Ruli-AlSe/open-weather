import { searchCityLocation } from '@/actions/search-city-location';

describe('Action - Search city location', () => {
  it('returns an array with cities and locations if the city matches', async () => {
    const response = await searchCityLocation('Salamanca');

    expect(response.length).toBe(5);
    expect(response).toContainEqual({
      name: expect.any(String),
      country: expect.any(String),
      state: expect.any(String),
      lat: expect.any(Number),
      lon: expect.any(Number),
    });
  });

  it('returns an array with cities and locations if the city matches', async () => {
    const response = await searchCityLocation('Invalid city');

    expect(response.length).toBe(0);
  });

  it('throws and error if something is wrong with the API call', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Server is down'))) as jest.Mock;

    const response = searchCityLocation('Salamanca');

    await expect(response).rejects.toThrow('Failed to search for city name');
  });
});
