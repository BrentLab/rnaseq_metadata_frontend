import { render, screen } from '@testing-library/react';
import ViewCell from './ViewCell';

test('renders learn react link', () => {
  render(<table><tbody><tr><TableCell value="test" /></tr></tbody></table>);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});

