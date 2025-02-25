import { act, render, renderHook, screen } from '@testing-library/react';

import { WeatherInfo } from '@/components';
import { useCityStore } from '@/stores';

describe('Component - Weather info', () => {
  const city = {
    name: 'Salamanca',
    country: 'MX',
    lat: 20.571358,
    lon: -101.192444,
    state: 'Guanajuato',
  };
  const headingText = 'Weather info for';

  it('renders nothing when the page loads first time', async () => {
    render(<WeatherInfo />);

    const heading = screen.queryByText(headingText);
    expect(heading).not.toBeInTheDocument();
  });

  describe('When an active city exists, should fetch city information', () => {
    it('if fetch is successful, renders the component', async () => {
      const { result } = renderHook(() => useCityStore((state) => state));
      render(<WeatherInfo />);
      act(() => result.current.setActiveCity(city));

      const heading = await screen.findByText(headingText);
      const favButton = await screen.findByText('Fav city');
      const seeMoreButton = await screen.findByText('See more info');

      expect(heading).toBeInTheDocument();
      expect(favButton).toBeInTheDocument();
      expect(seeMoreButton).toBeInTheDocument();
    });

    it('when clicking on favrite button, it should be added to favorites only once', async () => {
      const { result } = renderHook(() => useCityStore((state) => state));
      render(<WeatherInfo />);
      act(() => result.current.setActiveCity(city));

      const favButton = await screen.findByText('Fav city');
      act(() => favButton.click());
      expect(result.current.favCities).toHaveLength(1);

      act(() => favButton.click());
      expect(result.current.favCities).toHaveLength(1);
    });

    it('if fetch fails, does not render the component', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Server is down'))) as jest.Mock;
      const { result: cityStore } = renderHook(() => useCityStore((state) => state));
      render(<WeatherInfo />);
      act(() => cityStore.current.setActiveCity(city));

      const heading = screen.queryByText(headingText);

      expect(heading).not.toBeInTheDocument();
    });
  });
});
