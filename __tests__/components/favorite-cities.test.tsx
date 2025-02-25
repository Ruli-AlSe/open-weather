import { act, render, renderHook, screen } from '@testing-library/react';

import { FavoriteCities } from '@/components';
import { useCityStore } from '@/stores';

describe('Component - Favorite cities', () => {
  const cities = [
    {
      name: 'Salamanca',
      country: 'MX',
      lat: 20.571358,
      lon: -101.192444,
      state: 'Guanajuato',
    },
    {
      name: 'New York',
      country: 'US',
      lat: 40.7128,
      lon: -74.006,
      state: 'New York',
    },
  ];
  const headingText = 'Favorite Cities';

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the heading when the component loads', () => {
    render(<FavoriteCities />);

    const heading = screen.queryByText(headingText);
    expect(heading).toBeInTheDocument();
  });

  it('renders a text if there are no favorite cities in local storage', async () => {
    render(<FavoriteCities />);
    const heading = screen.queryByText(headingText);
    const text = await screen.findByText('No favorite cities added yet.');

    expect(heading).toBeInTheDocument();
    expect(text).toBeInTheDocument();
  });

  it('removes a city from the list when clicking on the remove button', async () => {
    localStorage.setItem('fav-cities', JSON.stringify(cities));
    render(<FavoriteCities />);

    const removeButton = await screen.findByTestId('remove-fav-city-Salamanca-Guanajuato-MX');
    act(() => removeButton.click());
    const cityCards = await screen.findAllByTestId('favorite-city');

    expect(cityCards).toHaveLength(1);
  });

  it('renders the favorite cities when they exist in local storage', async () => {
    localStorage.setItem('fav-cities', JSON.stringify(cities));
    render(<FavoriteCities />);
    const cityCards = await screen.findAllByTestId('favorite-city');

    expect(cityCards).toHaveLength(3);
  });

  it('set as active city when click on card title', async () => {
    localStorage.setItem('fav-cities', JSON.stringify(cities));
    const { result } = renderHook(() => useCityStore((state) => state));
    render(<FavoriteCities />);

    const cardTitle = (await screen.findAllByText('Salamanca'))[0];
    act(() => cardTitle.click());

    expect(result.current.activeCity).toEqual(cities[0]);
  });
});
