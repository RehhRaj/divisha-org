

export const detectFileType = (filename: string): 'csv' | 'xlsx' | 'txt' | 'xls' |'unknown' => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'csv':
      return 'csv';
    case 'xls':
       return 'xls'; // ✅ distinguish xls
    case 'xlsx':
      return 'xlsx'; // ✅ distinguish xlsx
    case 'txt':
      return 'txt';
    default:
      return 'unknown';
  }
};
