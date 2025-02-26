import { act, render, renderHook, screen } from '@testing-library/react';

import { DailyTempForecast } from '@/components';
import { useCityStore } from '@/stores';

describe('Component - Daily temp forecast', () => {
  const city = {
    name: 'Salamanca',
    country: 'MX',
    lat: 20.571358,
    lon: -101.192444,
    state: 'Guanajuato',
  };
  const headingText = 'Forecast max/min temp for the rest of the week';
  const cardsWrapperId = '#daily-temp-forecast-wrapper';

  it('renders nothing when the page loads first time', async () => {
    render(<DailyTempForecast />);

    // when the page loads initially resturns null
    const heading = screen.queryByText(headingText);
    expect(heading).not.toBeInTheDocument();
  });

  describe('When an active city exists, should fetch city information', () => {
    it('if fetch is successful, renders the component', async () => {
      const { result } = renderHook(() => useCityStore((state) => state));
      const { container } = render(<DailyTempForecast />);
      act(() => result.current.setActiveCity(city));

      const heading = await screen.findByText(headingText);
      const forecastWrapper = container.querySelector(cardsWrapperId);
      const cards = forecastWrapper?.childNodes;

      expect(heading).toBeInTheDocument();
      expect(forecastWrapper).toBeInTheDocument();
      expect(cards?.length).toBeGreaterThanOrEqual(5);
    });

    it('if fetch fails, does not render the component', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Server is down'))) as jest.Mock;
      const { result: cityStore } = renderHook(() => useCityStore((state) => state));
      const { container } = render(<DailyTempForecast />);
      act(() => cityStore.current.setActiveCity(city));

      const heading = screen.queryByText(headingText);
      const forecastWrapper = container.querySelector(cardsWrapperId);

      expect(heading).not.toBeInTheDocument();
      expect(forecastWrapper).not.toBeInTheDocument();
    });
  });
});
