// Utility to export array data to downloadable CSV file

export const exportToCSV = (data = [], filename = 'export.csv') => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Header Row
  csvRows.push(headers.join(','));

  // Data Rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const calculateOverdueFine = (dueDateStr, returnDateStr) => {
  if (!dueDateStr) return { daysLate: 0, fineAmount: 0 };

  const dueDate = new Date(dueDateStr);
  const targetDate = returnDateStr ? new Date(returnDateStr) : new Date();

  // Reset hours for accurate date difference calculation
  dueDate.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate - dueDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return {
      daysLate: diffDays,
      fineAmount: diffDays * 10 // 10 THB per day
    };
  }

  return { daysLate: 0, fineAmount: 0 };
};
