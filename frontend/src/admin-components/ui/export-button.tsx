"use client";

import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/admin-components/ui/button";

interface ExportButtonProps {
  data: any[];
  filename: string;
  sheetName?: string;
  className?: string;
}

export function ExportButton({ data, filename, sheetName = "Sheet1", className }: ExportButtonProps) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate buffer and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport}
      className={`border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 ${className}`}
    >
      <Download className="w-4 h-4 mr-2" />
      Xuất Excel
    </Button>
  );
}
