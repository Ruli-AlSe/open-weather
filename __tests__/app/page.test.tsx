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

  it('renders search component', async () => {
    const ResolvedPage = await resolvedComponent(Page);
    render(<ResolvedPage />);

    const heading = screen.getByText('Search for any city in the world and click on it');
    const searchBar = screen.getByPlaceholderText('Enter location');

    expect(heading).toBeInTheDocument();
    expect(searchBar).toBeInTheDocument();
  });

  it('renders favorite cities component', async () => {
    const ResolvedPage = await resolvedComponent(Page);
    render(<ResolvedPage />);

    const heading = screen.getByText('Favorite Cities');

    expect(heading).toBeInTheDocument();
  });

  it('matches snapshot', async () => {
    const ResolvedPage = await resolvedComponent(Page);
    const { asFragment } = render(<ResolvedPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
