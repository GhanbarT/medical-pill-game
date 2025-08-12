'use client';
import { RippleButton } from '@/components/animate-ui/buttons/ripple';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/animate-ui/radix/dropdown-menu';
import { usePathname } from '@/i18n/navigation';
import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export function Header() {
  const t = useTranslations('game');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(`/${newLocale}${pathname}`);
    }
  };

  return (
    <header className="sticky top-2 z-50 mx-auto mb-4 flex w-full max-w-7xl items-center justify-between gap-4 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white shadow-lg backdrop-blur-md transition-all duration-300">
      {/* Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold tracking-tight drop-shadow-md sm:text-xl md:text-2xl lg:text-2xl">
          {t('title')} 💊
        </h1>
      </div>

      {/* Language Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <RippleButton
            variant={'outline'}
            className="rounded-md bg-white/20 px-4 py-2 text-sm transition-all duration-200 hover:bg-white/30 sm:text-sm md:text-sm"
            aria-label="Language"
          >
            <Languages className="h-4 w-4" />
            {t('language')}
          </RippleButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem onSelect={() => changeLanguage('en')}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => changeLanguage('fa')}>
            فارسی
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
