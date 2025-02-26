import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';

import { SearchBar } from '@/components';
import { useCityStore } from '@/stores';

describe('Component - Search bar', () => {
  const headingText = 'Search for any city in the world and click on it';

  it('renders the heading and search bar when the component loads', () => {
    render(<SearchBar />);

    const heading = screen.queryByText(headingText);
    const searchBar = screen.queryByRole('textbox');
    expect(heading).toBeInTheDocument();
    expect(searchBar).toBeInTheDocument();
  });

  describe('when the user types in the search bar, search the city in the API', () => {
    it('displays a list of cities that match the search query', async () => {
      render(<SearchBar />);
      const searchBar = screen.queryByRole('textbox');
      fireEvent.change(searchBar!, { target: { value: 'salamanca' } });

      const cityOptions = await screen.findAllByTestId('search-city-option');
      expect(cityOptions.length).toBeGreaterThanOrEqual(1);
    });

    it('displays an error message if the search does not match', async () => {
      render(<SearchBar />);
      const searchBar = screen.queryByRole('textbox');
      fireEvent.change(searchBar!, { target: { value: 'invalid city' } });

      const errorMessage = await screen.findByTestId('search-error-message');
      expect(errorMessage).toHaveTextContent('No results found for " invalid city "');
    });
  });

  it('sets as active city by clicking on one of the options', async () => {
    render(<SearchBar />);
    const searchBar = screen.queryByRole('textbox');
    fireEvent.change(searchBar!, { target: { value: 'salamanca' } });
    const { result } = renderHook(() => useCityStore((state) => state));

    expect(result.current.activeCity).toEqual(null);
    const cityOptions = await screen.findAllByTestId('search-city-option');
    act(() => cityOptions[0].click());

    expect(result.current.activeCity).toMatchObject({
      name: expect.any(String),
      country: expect.any(String),
      state: expect.any(String),
      lat: expect.any(Number),
      lon: expect.any(Number),
    });
  });
});
