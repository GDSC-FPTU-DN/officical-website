'use client';

import { NextUIProvider } from '@nextui-org/system';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';
import * as React from 'react';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextUIProvider>
      <SessionProvider>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </SessionProvider>
    </NextUIProvider>
  );
}
