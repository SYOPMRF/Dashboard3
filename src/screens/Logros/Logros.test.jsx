import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Logros from "./Logros";
import { supabase2 } from "../../supabase/supabase";
import jsPDF from "jspdf";

// Mock de Supabase
vi.mock("../../supabase/supabase", () => ({
  supabase2: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn(),
  },
}));

// Mock de jsPDF
vi.mock("jspdf", () => {
  const autoTable = vi.fn();
  const save = vi.fn();
  return {
    default: vi.fn(() => ({
      text: vi.fn(),
      autoTable,
      save,
    })),
  };
});

describe("Logros Component", () => {
  it("debería renderizar las insignias con sus datos iniciales", () => {
    render(<Logros />);

    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles).toHaveLength(5);
    expect(titles[0].textContent).toBe("Primer Logro");
  });

  it("debería actualizar los scores al obtener datos de Supabase", async () => {
    // Mock de datos de Supabase
    const mockData = [
      { id: 12, score: 4 },
      { id: 2, score: 2 },
    ];
    supabase2.select.mockResolvedValueOnce({ data: mockData, error: null });

    render(<Logros />);

    await waitFor(() => {
      expect(screen.getByText('Puntuación: 4')).to.exist;

    });
  });

  it("debería manejar errores de Supabase", async () => {
    // Simular un error en Supabase
    supabase2.from.mockReturnValueOnce({
      select: vi.fn().mockResolvedValueOnce({ data: null, error: { message: "Error al cargar" } }),
    });
  
    render(<Logros />);
  
    // Verificar si el texto "Puntuación: 0" está presente
    const badges = screen.getAllByText(/Puntuación: 0/i);
    expect(badges.length).to.be.greaterThan(0);  // Aserción de Chai
  });

  it("debería generar un PDF al hacer clic en 'Descargar PDF'", async () => {
    render(<Logros />);

    const downloadButton = screen.getByRole("button", { name: /descargar pdf/i });
    await userEvent.click(downloadButton);

    expect(jsPDF).toHaveBeenCalled();
    const mockPdfInstance = jsPDF.mock.results[0].value;
    expect(mockPdfInstance.autoTable).toHaveBeenCalled();
    expect(mockPdfInstance.save).toHaveBeenCalledWith("reporte_logros.pdf");
  });
});
