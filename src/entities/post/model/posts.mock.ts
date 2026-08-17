import type { Post } from './types';

export const postsMock = [
  {
    id: 'morning-walk',
    author: 'Maya Brooks',
    handle: '@mayab',
    avatarColor: '#ef8354',
    avatarShape: 'circle',
    publishedAt: '18 min',
    text: 'Slow mornings, good coffee, and nowhere urgent to be. A solid start to the weekend.',
    imageUrl:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'A warm cup of coffee on a wooden table',
    likes: 128,
    replies: 12,
    comments: 9,
  },
  {
    id: 'small-progress',
    author: 'Noah Kim',
    handle: '@noahmakes',
    avatarColor: '#5f6fff',
    avatarShape: 'square',
    publishedAt: '1 hr',
    text: 'Reminder: small progress is still progress. I shipped the first version of a project I have been overthinking for weeks — and it feels great.',
    likes: 84,
    replies: 7,
    comments: 14,
  },
  {
    id: 'quiet-places',
    author: 'Iris Chen',
    handle: '@irisoutside',
    avatarColor: '#38a169',
    avatarShape: 'circle',
    publishedAt: '3 hrs',
    text: 'Found a quiet place at the edge of the city. Keeping this one on my list for slow Sunday walks.',
    imageUrl:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'A quiet mountain lake surrounded by green hills',
    likes: 246,
    replies: 28,
    comments: 21,
  },
] satisfies readonly Post[]
