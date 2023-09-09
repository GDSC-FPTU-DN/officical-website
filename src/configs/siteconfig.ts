import { env } from 'process';
import { NavItem } from '../types';

export const siteConfig = {
  url: env.NEXT_PUBLIC_APP_URL,
  title: 'My Blog',
  subtitle: 'This is my personal blog',
  description: 'This is my personal blog',
  name: 'My Blog',
  og: {
    image: env.NEXT_PUBLIC_APP_URL + '/og/title=GDSC',
    title: 'GDSC',
    description: 'GDSC',
    icon: '/images/small-logo.webp',
  },
};

export const mainNav: NavItem[] = [
  {
    title: 'Events',
    href: '/events',
  },
  {
    title: 'Projects',
    href: '/projects',
  },
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
];
