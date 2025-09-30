// File: frontend/src/app/(dashboard)/school/[tenantSlug]/timetable/page.tsx

'use client';

import { useParams } from 'next/navigation';
import React from 'react';

const dummyTimetable = [
  { day: 'Monday', periods: ['Math', 'Science', 'English', 'History'] },
  { day: 'Tuesday', periods: ['Biology', 'Math', 'Geography', 'PE'] },
  { day: 'Wednesday', periods: ['Physics', 'Chemistry', 'English', 'Art'] },
  { day: 'Thursday', periods: ['Math', 'Computer', 'English', 'Civics'] },
  { day: 'Friday', periods: ['Economics', 'Science', 'Math', 'Music'] },
];

export default function TimetablePage() {
  const params = useParams();
  const tenantSlug = params?.tenantSlug;

  return (
    <div className="p-6">
    <h1>frontend/src/app/(dashboard)/school/[tenantSlug]/dashboard/timetable/page.tsx</h1>
      <h1 className="text-2xl font-semibold mb-4">
        Timetable for Tenant: <span className="text-blue-600">{tenantSlug}</span>
      </h1>

      <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Day</th>
              <th className="px-4 py-2">Period 1</th>
              <th className="px-4 py-2">Period 2</th>
              <th className="px-4 py-2">Period 3</th>
              <th className="px-4 py-2">Period 4</th>
            </tr>
          </thead>
          <tbody>
            {dummyTimetable.map((row) => (
              <tr key={row.day} className="border-t">
                <td className="px-4 py-2 font-medium">{row.day}</td>
                {row.periods.map((subject, i) => (
                  <td key={i} className="px-4 py-2">
                    {subject}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
