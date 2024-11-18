import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  async exportToExcel(data: any[], filename: string): Promise<void> {
    try {
      // Dynamically import XLSX only when needed
      const XLSX = await import('xlsx');
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Set column widths
      const colWidths = [
        { wch: 20 }, // Player
        { wch: 20 }, // Team
        { wch: 10 }, // Played
        { wch: 10 }, // Won
        { wch: 10 }, // Drawn
        { wch: 10 }, // Lost
        { wch: 12 }, // Goals For
        { wch: 12 }, // Goals Against
        { wch: 10 }  // Points
      ];
      ws['!cols'] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'League Standings');

      // Save file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      throw error;
    }
  }
}
