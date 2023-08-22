import { NavItem } from '../types';

export const siteConfig = {
  url: 'https://www.example.com',
  title: 'My Blog',
  subtitle: 'This is my personal blog',
  description: 'This is my personal blog',
  name: 'My Blog',
  og: {
    image: 'http://localhost:3000/og?title=GDSC',
    title: 'GDSC',
    description: 'GDSC',
  },
};

export const mainNav: NavItem[] = [
  {
    title: 'Events',
    href: 'events',
  },
  {
    title: 'Projects',
    href: 'projects',
  },
  {
    title: 'About',
    href: 'about',
  },
  {
    title: 'Blog',
    href: 'blog',
  },
];