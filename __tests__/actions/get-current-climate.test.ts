import { getCurrentClimate } from '@/actions/get-current-climate';

describe('Action - Get current climate', () => {
  it('returns valid data when valid params are passed to it', async () => {
    const response = await getCurrentClimate(20.571358, -101.192444);

    expect(response).toMatchObject({
      coord: expect.objectContaining({
        lon: expect.any(Number),
        lat: expect.any(Number),
      }),
      weather: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          main: expect.any(String),
          description: expect.any(String),
          icon: expect.any(String),
        }),
      ]),
      main: expect.objectContaining({
        temp: expect.any(Number),
        feels_like: expect.any(Number),
        temp_min: expect.any(Number),
        temp_max: expect.any(Number),
        pressure: expect.any(Number),
        humidity: expect.any(Number),
        sea_level: expect.any(Number),
        grnd_level: expect.any(Number),
      }),
    });
  });

  it('throws and error if something is wrong with the API call', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Server is down'))) as jest.Mock;

    const response = getCurrentClimate(20.571358, -101.192444);

    await expect(response).rejects.toThrow('Failed to fetch current weather information');
  });
});
