import { JsonValue } from '@prisma/client/runtime/library';
import sl from 'slugify';
import { siteConfig } from '../configs/siteconfig';

export const absoluteUrl = (path: string) => {
  return `${siteConfig.url}${path}`;
};

export const removeBreakAndTrim = (text: string) => {
  return text.replace(/(\r\n|\n|\r)/gm, '').trim();
};

export function toTitleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function slugtify(text: string): string {
  return sl(text, { lower: true, strict: true });
}

export function generateOgImage(text: string, slot?: number): string {
  const _slot = slot || Math.floor(Math.random() * 10) + 1;
  return `${siteConfig.url}/og?title=${text}&slot=${_slot}`;
}

export const estimateReadingTimeByWordCount = (wordCount: number) => {
  const wordsPerMinute = 200;
  const minutes = wordCount / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return readTime;
};

export const estimateReadingTimeByContent = (content: JsonValue) => {
  if (!content) return 0;
  //travel all the way down and count the words in text fields
  let wordCount = 0;
  const travel = (node: JsonValue) => {
    if (typeof node === 'string') {
      wordCount += node.split(' ').length;
    } else if (typeof node === 'object') {
      Object.values(node as any).forEach((value) => {
        if (typeof value === 'string') wordCount += value.split(' ').length;
        else travel(value as any);
      });
    }
  };
  travel(content);
  return estimateReadingTimeByWordCount(wordCount);
};
