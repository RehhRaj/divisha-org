'use client';
import { ReportData } from './utils/types';

export default function ReportViewer({ report }: { report: ReportData }) {

  
  return (
    <div>
      <h3>Generated Report</h3>
      <p>{report.summary}</p>
{     
      <table>
        <tbody>
          {report.rows.map((row, idx) => (
            <tr key={idx}>
              {row.map((cell, cIdx) => <td key={cIdx}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table> 
      }
    
    </div>
  );
}
