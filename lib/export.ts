"use client";

/**
 * Report exports that actually produce a file.
 *
 * CSV is written by hand (no dependency worth taking for a comma). XLSX loads
 * its writer only when someone clicks Excel, so the 200-odd KB never reaches
 * visitors who don't export. PDF goes through the browser's print dialog —
 * that produces a real PDF via "Save as PDF" without shipping a PDF engine,
 * and the print stylesheet in globals.css makes the page come out clean.
 */

export type ExportFormat = "csv" | "xlsx" | "pdf";

/** A table to export: a header row plus string/number cells. */
export interface ExportTable {
  /** Used as the file name, without extension. */
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment to start the download before revoking.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Quote a CSV cell only when it needs it, and double any inner quotes. */
function csvCell(value: string | number): string {
  const s = String(value ?? "");
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function exportCsv({ filename, headers, rows }: ExportTable) {
  const body = [headers, ...rows].map((r) => r.map(csvCell).join(";")).join("\r\n");
  /**
   * Semicolons and a BOM: Excel on a Turkish locale splits on ";" and needs
   * the BOM to read UTF-8, otherwise "ğ", "ş" and "ı" arrive as mojibake.
   */
  const blob = new Blob([`﻿${body}`], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, `${filename}.csv`);
}

export async function exportXlsx({ filename, headers, rows }: ExportTable) {
  // The browser build is the one that can hand the file to the download bar.
  const writeXlsxFile = (await import("write-excel-file/browser")).default;

  const data = [
    headers.map((h) => ({ value: h, fontWeight: "bold" as const })),
    ...rows.map((row) =>
      row.map((cell) =>
        typeof cell === "number"
          ? { value: cell, type: Number }
          : { value: String(cell), type: String },
      ),
    ),
  ];

  await writeXlsxFile(data, {
    // Roughly size the columns to their headers so nothing arrives as "####".
    columns: headers.map((h) => ({ width: Math.max(14, h.length + 4) })),
  }).toFile(`${filename}.xlsx`);
}

/**
 * Hands the page to the browser's print dialog, where "Save as PDF" is the
 * usual destination. Anything marked `print:hidden` drops out first.
 */
export function exportPdf() {
  window.print();
}

export async function runExport(format: ExportFormat, table: ExportTable) {
  if (format === "csv") return exportCsv(table);
  if (format === "xlsx") return exportXlsx(table);
  return exportPdf();
}
