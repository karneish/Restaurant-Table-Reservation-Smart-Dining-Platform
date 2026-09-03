export interface ValidationResult { valid: boolean; errors: string[]; }
export function required(value: unknown, field: string): string | null {
  if (value === null || value === undefined || value === '') return `${field} is required`;
  if (typeof value === 'string' && value.trim().length === 0) return `${field} cannot be empty`;
  return null;
}
export function minLength(value: string, min: number, field: string): string | null {
  return value.length < min ? `${field} must be at least ${min} characters` : null;
}
export function maxLength(value: string, max: number, field: string): string | null {
  return value.length > max ? `${field} must be no more than ${max} characters` : null;
}
export function validEmail(value: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email address';
}
export function validPhone(value: string): string | null {
  return /^[6-9]\d{9}$/.test(value.replace(/[\s\-+91]/g, '')) ? null : 'Invalid phone number';
}
export function strongPassword(value: string): string | null {
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter';
  if (!/[a-z]/.test(value)) return 'Must contain lowercase letter';
  if (!/[0-9]/.test(value)) return 'Must contain a number';
  return null;
}
export function validPartySize(value: number): string | null {
  return (value < 1 || value > 20) ? 'Party size must be 1-20' : null;
}
