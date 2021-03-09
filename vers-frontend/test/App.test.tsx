import * as React from 'react';
import { render, screen, unmountComponentAtNode } from '@testing-library/react';
import { act } from "react-dom/test-utils";
import App from './index';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders with or without a name", () => {
  act(() => {
    render(<App />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<App />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<App />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
