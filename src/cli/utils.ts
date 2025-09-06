import type { CLIConfig } from './types';

export function getConfig(): CLIConfig {
  const apiKey = process.env.QUANTCAST_API_KEY;
  const apiSecret = process.env.QUANTCAST_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error('Error: Missing required environment variables');
    console.error('Please set QUANTCAST_API_KEY and QUANTCAST_API_SECRET');
    process.exit(1);
  }

  return { apiKey, apiSecret };
}

export function formatOutput(data: any, format: 'json' | 'table' = 'json'): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  // Simple table format - can be enhanced
  if (Array.isArray(data)) {
    if (data.length === 0) return 'No data';
    
    const headers = Object.keys(data[0] || {});
    const separator = headers.map(h => '-'.repeat(h.length)).join(' | ');
    const headerRow = headers.join(' | ');
    
    const rows = data.map(item => 
      headers.map(header => String(item[header] || '')).join(' | ')
    );
    
    return [headerRow, separator, ...rows].join('\n');
  }
  
  return JSON.stringify(data, null, 2);
}

export function parseFilters(filterStrings?: string[]): Array<{ breakdown: string; values: string[] }> | undefined {
  if (!filterStrings) return undefined;
  
  return filterStrings.map(filterStr => {
    const [breakdown, ...values] = filterStr.split('=');
    if (!breakdown || values.length === 0) {
      throw new Error(`Invalid filter format: ${filterStr}. Use: breakdown=value1,value2`);
    }
    
    return {
      breakdown: breakdown.trim(),
      values: values.join('=').split(',').map(v => v.trim())
    };
  });
}

export function validateDateFormat(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

export function logError(error: unknown): void {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
  } else {
    console.error('An unknown error occurred:', error);
  }
}