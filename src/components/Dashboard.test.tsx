import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import '@testing-library/jest-dom';
import { Dashboard } from "../screens";


describe("Dashboard", () => {
  test("debería renderizarl el título", () => {
    render(<Dashboard title="Titulo" />);
    
    const titleElement = screen.getByText(/Titulo/i);
    expect(titleElement).toBeInTheDocument();
  });
});


