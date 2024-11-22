import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import PageNotFound from '../../screens/error/PageNotFound'; // Ajusta la ruta según tu estructura
import { expect, test } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';


// Prueba de accesibilidad en el botón de cierre de la barra lateral
test('Verifica que el botón "Cerrar barra lateral" tiene aria-label', () => {
  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );

  // Busca el botón de cerrar la barra lateral por su rol y aria-label
  const closeButton = screen.getByRole('button', { name: /Cerrar barra lateral/i });
  expect(closeButton).toBeInTheDocument();

  // Verifica que el botón tiene el atributo aria-label adecuado
  expect(closeButton).toHaveAttribute('aria-label', 'Cerrar barra lateral');
});
