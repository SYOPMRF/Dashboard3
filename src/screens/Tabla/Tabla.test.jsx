import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TablaClasificacion from "./Tabla";
import { supabase } from "../../supabase/supabase";

// Mock de Supabase
vi.mock("../../supabase/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [
            { id: 1, name: "Jose", level: 10, points: 2800 },
            { id: 2, name: "Alberto", level: 7, points: 1900 },
            { id: 3, name: "Lola", level: 4, points: 1000 },
            { id: 4, name: "Alfonso", level: 3, points: 300 },
          ],
          error: null,
        })),
      })),
    })),
  },
}));

describe("TablaClasificacion", () => {
  beforeAll(() => {
    // Mock de `URL.createObjectURL` para evitar errores en pruebas
    global.URL.createObjectURL = vi.fn(() => "mocked_url");
  });

  it("renderiza la tabla con datos de Supabase", async () => {
    render(<TablaClasificacion />);

    // Espera a que los datos sean cargados
    await waitFor(() => {
      expect(screen.getByText("Jose")).toBeInTheDocument();
      expect(screen.getByText("Alberto")).toBeInTheDocument();
    });

    // Verifica el número de filas
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(5); // 4 usuarios + encabezado
  });

  it("debería generar un CSV al hacer clic en 'Descargar como CSV'", async () => {
    render(<TablaClasificacion />);

    const csvButton = await waitFor(() => screen.getByText("Descargar como CSV"));

    // Mock de `document.createElement` para simular el clic en el enlace de descarga
    const createElementSpy = vi.spyOn(document, "createElement");
    const linkMock = { click: vi.fn(), setAttribute: vi.fn() };
    createElementSpy.mockImplementation((tagName) => {
      if (tagName === "a") return linkMock;
      return document.createElement(tagName);
    });

    // Disparar el evento de clic en el botón de descarga
    fireEvent.click(csvButton);

    // Verifica que `createElement` haya sido llamado con 'a'
    expect(createElementSpy).toHaveBeenCalledWith("a");

    // Verifica que `click` haya sido llamado en el enlace
    expect(linkMock.click).toHaveBeenCalled();

    // Verifica que `URL.createObjectURL` haya sido llamado
    expect(global.URL.createObjectURL).toHaveBeenCalled();

    // Limpieza del mock
    createElementSpy.mockRestore();
  });
});
