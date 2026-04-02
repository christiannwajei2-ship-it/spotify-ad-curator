function escapeCSV(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toHumanReadable(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export function exportToCSV(
  data: Record<string, unknown>[],
  columns: string[],
  filename: string
): void {
  const BOM = '\uFEFF';
  const headers = columns.map(toHumanReadable).map(escapeCSV).join(',');
  const rows = data.map((row) =>
    columns.map((col) => escapeCSV(row[col])).join(',')
  );
  const csv = BOM + [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
