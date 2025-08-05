import { getDirection } from '@/i18n/direction';
import { useLocale } from 'next-intl';

export default function useTextDirection() {
  const currentLocale = useLocale();
  return getDirection(currentLocale);
}
