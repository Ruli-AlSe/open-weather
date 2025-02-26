import { getHourlyForecast } from '@/actions/get-hourly-forecast';

describe('Action - Get Hourly Forecast', () => {
  it('returns valid data when valid params are passed to it', async () => {
    const response = await getHourlyForecast(20.571358, -101.192444);

    expect(response.length).toBeGreaterThan(20);
    expect(response).toContainEqual({
      dt_txt: expect.any(String),
      temp: expect.any(Number),
    });
  });

  it('throws and error if something is wrong with the API call', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Server is down'))) as jest.Mock;

    const response = getHourlyForecast(20.571358, -101.192444);

    await expect(response).rejects.toThrow('Failed to fetch hourly forecast information');
  });
});
