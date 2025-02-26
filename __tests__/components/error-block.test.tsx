import { act, render, renderHook, screen } from '@testing-library/react';

import { ErrorBlock } from '@/components';
import { useErrorStore } from '@/stores';

describe('Component - Error block message', () => {
  it('renders nothing if no errors in store', () => {
    render(<ErrorBlock />);

    const errorBlocks = screen.queryAllByTestId('error-alert');
    expect(errorBlocks.length).toBe(0);
  });

  it('renders a block component for each error in the store', async () => {
    const { result } = renderHook(() => useErrorStore((state) => state));
    render(<ErrorBlock />);

    act(() => {
      result.current.setError('Failed to fetch hourly forecast information');
      result.current.setError('Failed to fetch city information');
      result.current.setError('Failed to fetch current weather information');
    });

    const errorBlocks = await screen.findAllByTestId('error-alert');
    expect(result.current.errors.length).toBe(3);
    expect(errorBlocks.length).toBe(3);
    expect(errorBlocks[2]).toHaveTextContent('Failed to fetch current weather information');
  });

  test('removes the error after 4 seconds', async () => {
    const { result } = renderHook(() => useErrorStore((state) => state));
    render(<ErrorBlock />);
    act(() => {
      result.current.setError('Failed to fetch hourly forecast information');
    });

    const errorBlocks = await screen.findAllByTestId('error-alert');
    expect(errorBlocks.length).toBeGreaterThan(0);

    // wait 4 seconds to check if the error is removed
    return new Promise((resolve) => setTimeout(resolve, 4000)).then(() => {
      expect(result.current.errors.length).toBe(0);
      const errorBlocks = screen.queryAllByTestId('error-alert');
      expect(errorBlocks.length).toBe(0);
    });
  });
});
