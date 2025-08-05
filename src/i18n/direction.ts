export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur']; // Add more as needed

export function getDirection(locale: string): 'rtl' | 'ltr' {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}
