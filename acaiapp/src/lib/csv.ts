export function arrayToCsv<T extends Record<string, unknown>>(rows: T[], headers: (keyof T)[]) {
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        if (value == null) return "";
        const stringValue = String(value).replace(/"/g, '""');
        if (stringValue.includes(",") || stringValue.includes("\n")) {
          return `"${stringValue}"`;
        }
        return stringValue;
      })
      .join(",")
  );

  return [headerLine, ...dataLines].join("\n");
}