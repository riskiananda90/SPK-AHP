
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportData {
  projectName: string;
  criteria: any[];
  alternatives: any[];
  results: any;
  consistency: any;
}

export const exportToExcel = (data: ExportData) => {
  const wb = XLSX.utils.book_new();
  
  // Sheet 1: Project Info
  const projectInfo = [
    ['Nama Project', data.projectName],
    ['Metode', 'AHP (Analytic Hierarchy Process)'],
    ['Tanggal Export', new Date().toLocaleDateString('id-ID')],
    [''],
    ['Konsistensi Ratio', data.consistency?.cr?.toFixed(4) || 'N/A'],
    ['Status Konsistensi', data.consistency?.isConsistent ? 'Konsisten' : 'Tidak Konsisten']
  ];
  
  const ws1 = XLSX.utils.aoa_to_sheet(projectInfo);
  XLSX.utils.book_append_sheet(wb, ws1, 'Info Project');
  
  // Sheet 2: Criteria Weights
  if (data.results?.criteriaWeights) {
    const criteriaData = [
      ['No', 'Kriteria', 'Bobot', 'Persentase'],
      ...data.results.criteriaWeights.map((item: any, index: number) => [
        index + 1,
        item.criteria.name,
        item.weight.toFixed(4),
        (item.weight * 100).toFixed(2) + '%'
      ])
    ];
    
    const ws2 = XLSX.utils.aoa_to_sheet(criteriaData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Bobot Kriteria');
  }
  
  // Sheet 3: Final Ranking
  if (data.results?.alternatives) {
    const rankingData = [
      ['Ranking', 'Alternatif', 'Skor', 'Persentase'],
      ...data.results.alternatives.map((alt: any) => [
        alt.rank,
        alt.name,
        alt.score.toFixed(4),
        (alt.score * 100).toFixed(2) + '%'
      ])
    ];
    
    const ws3 = XLSX.utils.aoa_to_sheet(rankingData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Ranking Alternatif');
  }
  
  // Save file
  XLSX.writeFile(wb, `${data.projectName}_AHP_Analysis.xlsx`);
};

export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Laporan Analisis AHP', 20, 30);
  
  // Project Info
  doc.setFontSize(14);
  doc.text(`Project: ${data.projectName}`, 20, 50);
  doc.setFontSize(12);
  doc.text(`Metode: AHP (Analytic Hierarchy Process)`, 20, 65);
  doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 75);
  
  // Consistency Info
  if (data.consistency) {
    doc.text(`Consistency Ratio: ${data.consistency.cr?.toFixed(4) || 'N/A'}`, 20, 90);
    doc.text(`Status: ${data.consistency.isConsistent ? 'Konsisten' : 'Tidak Konsisten'}`, 20, 100);
  }
  
  let yPosition = 120;
  
  // Criteria Weights Table
  if (data.results?.criteriaWeights) {
    doc.setFontSize(14);
    doc.text('Bobot Kriteria', 20, yPosition);
    yPosition += 10;
    
    const criteriaTableData = data.results.criteriaWeights.map((item: any, index: number) => [
      (index + 1).toString(),
      item.criteria.name,
      item.weight.toFixed(4),
      (item.weight * 100).toFixed(2) + '%'
    ]);
    
    (doc as any).autoTable({
      head: [['No', 'Kriteria', 'Bobot', 'Persentase']],
      body: criteriaTableData,
      startY: yPosition,
      margin: { left: 20 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }
  
  // Final Ranking Table
  if (data.results?.alternatives) {
    doc.setFontSize(14);
    doc.text('Ranking Alternatif', 20, yPosition);
    yPosition += 10;
    
    const rankingTableData = data.results.alternatives.map((alt: any) => [
      alt.rank.toString(),
      alt.name,
      alt.score.toFixed(4),
      (alt.score * 100).toFixed(2) + '%'
    ]);
    
    (doc as any).autoTable({
      head: [['Ranking', 'Alternatif', 'Skor', 'Persentase']],
      body: rankingTableData,
      startY: yPosition,
      margin: { left: 20 }
    });
  }
  
  // Save PDF
  doc.save(`${data.projectName}_AHP_Analysis.pdf`);
};
