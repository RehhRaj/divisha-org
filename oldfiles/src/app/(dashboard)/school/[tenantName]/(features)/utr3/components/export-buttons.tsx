'use client';
import { ReportData } from './utils/types'
// './utils/types';

export default function ExportButtons({ report }: { report: ReportData }) {
  const handleExport = () => {
    alert('Export functionality coming soon!');
  };

  return (
    <div>
      <button onClick={handleExport}>Export to CSV</button>
    </div>
  );
}
