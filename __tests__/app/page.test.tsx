import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Page from '@/app/page';
import { JSX } from 'react';

async function resolvedComponent(Component: () => Promise<JSX.Element>) {
  const ComponentResolved = await Component();
  return () => ComponentResolved;
}

describe('Main Page', () => {
  it('renders a heading', async () => {
    const ResolvedPage = await resolvedComponent(Page);
    render(<ResolvedPage />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Weather Forecast');
  });
});
