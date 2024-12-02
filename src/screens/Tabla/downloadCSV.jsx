const downloadCSV = (data) => {
    const csvContent = [
      "\uFEFF", // BOM para UTF-8
      ["PosiciÃ³n", "Usuario", "Puntos"],
      ...data.map((user, index) => [
        index + 1,
        user.email.normalize("NFC"), // Normalizar texto
        user.score,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tabla_puntajes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  