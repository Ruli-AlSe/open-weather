import { getDailyTempForecast } from '@/actions/get-daily-temp-forecast';

describe('Action - Get daily temperature forecast', () => {
  it('returns valid data when valid params are passed to it', async () => {
    const response = await getDailyTempForecast(20.571358, -101.192444);

    expect(response.length).toBe(6);
    expect(response).toContainEqual({
      dt_txt: expect.any(String),
      temp_max: expect.any(Number),
      temp_min: expect.any(Number),
    });
  });

  it('throws and error if something is wrong with the API call', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Server is down'))) as jest.Mock;

    const response = getDailyTempForecast(20.571358, -101.192444);

    await expect(response).rejects.toThrow('Failed to fetch daily temperature information');
  });
});
