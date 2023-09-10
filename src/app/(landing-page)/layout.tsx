import { Metadata } from 'next';
import React from 'react';
import MainNavbar from '../../components/navbar';
import { mainNav } from '../../configs/siteconfig';

type Props = {
  children: React.ReactNode;
};
export const metadata: Metadata = {};
export const metadata: Metadata = {};

function MainLayout({ children }: Props) {
  return (
    <main className="h-full">
      <MainNavbar items={mainNav} />

      <section className="h-full">{children}</section>
    </main>
  );
}

export default MainLayout;
