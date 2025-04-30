import { Definition, Word } from '../types';

export const mockWords: Word[] = [
  {
    id: '1',
    word: 'Doom Scrolling',
    definitions: [
      {
        id: '1a',
        word: 'Doom Scrolling',
        meaning: 'The act of continuously scrolling through bad news on social media despite the negative psychological effects this may have.',
        example: 'After the election, I spent two hours doom scrolling through Twitter before I finally put my phone down.',
        author: 'urban_fanatic',
        date: '2020-04-15',
        upvotes: 2543,
        downvotes: 124,
        tags: ['social media', 'anxiety', 'habits']
      },
      {
        id: '1b',
        word: 'Doom Scrolling',
        meaning: 'When you can\'t stop scrolling through all of the bad news, even though it\'s making you anxious and depressed.',
        example: 'I need to stop doom scrolling before bed, it\'s giving me nightmares.',
        author: 'scrollmaster',
        date: '2020-05-22',
        upvotes: 1876,
        downvotes: 87,
        tags: ['covid', 'social media', 'depression']
      }
    ]
  },
  {
    id: '2',
    word: 'Rizz',
    definitions: [
      {
        id: '2a',
        word: 'Rizz',
        meaning: 'Short for charisma, it refers to someone\'s ability to attract another person through style, charm, and swagger.',
        example: 'That guy has insane rizz, he got her number within five minutes of talking to her.',
        author: 'rizzlord',
        date: '2022-09-10',
        upvotes: 4365,
        downvotes: 321,
        tags: ['dating', 'gen z', 'slang']
      }
    ]
  },
  {
    id: '3',
    word: 'Ghosting',
    definitions: [
      {
        id: '3a',
        word: 'Ghosting',
        meaning: 'The act of suddenly cutting off all communication with someone without explanation, especially in a dating context.',
        example: 'We went on three great dates, then she started ghosting me. I never heard from her again.',
        author: 'dating_detective',
        date: '2018-07-15',
        upvotes: 7845,
        downvotes: 235,
        tags: ['dating', 'relationships', 'communication']
      }
    ]
  },
  {
    id: '4',
    word: 'GOAT',
    definitions: [
      {
        id: '4a',
        word: 'GOAT',
        meaning: 'Acronym for "Greatest Of All Time". Used to refer to the best person ever in their field.',
        example: 'Michael Jordan is the GOAT of basketball.',
        author: 'sports_fanatic',
        date: '2016-02-28',
        upvotes: 8923,
        downvotes: 412,
        tags: ['sports', 'acronym', 'compliment']
      }
    ]
  },
  {
    id: '5',
    word: 'Slay',
    definitions: [
      {
        id: '5a',
        word: 'Slay',
        meaning: 'To do something with spectacular success or style. To knock it out of the park.',
        example: 'She absolutely slayed that presentation, the clients were blown away.',
        author: 'queen_bee',
        date: '2019-05-04',
        upvotes: 6745,
        downvotes: 298,
        tags: ['compliment', 'success', 'fashion']
      }
    ]
  },
  {
    id: '6',
    word: 'Situationship',
    definitions: [
      {
        id: '6a',
        word: 'Situationship',
        meaning: 'A relationship that has no label on it; a relationship where you do relationship things but aren\'t technically in a relationship.',
        example: 'We\'ve been in a situationship for six months now, but neither of us wants to define it.',
        author: 'relationship_guru',
        date: '2020-11-12',
        upvotes: 5432,
        downvotes: 187,
        tags: ['dating', 'relationships', 'commitment']
      }
    ]
  },
  {
    id: '7',
    word: 'Cheugy',
    definitions: [
      {
        id: '7a',
        word: 'Cheugy',
        meaning: 'The opposite of trendy. Used to describe something that was once in style but is now outdated or trying too hard.',
        example: 'Wearing Uggs and drinking pumpkin spice lattes is considered cheugy now.',
        author: 'trend_watcher',
        date: '2021-03-30',
        upvotes: 4231,
        downvotes: 1876,
        tags: ['fashion', 'gen z', 'trends']
      }
    ]
  },
  {
    id: '8',
    word: 'Stan',
    definitions: [
      {
        id: '8a',
        word: 'Stan',
        meaning: 'An overzealous or obsessive fan of a particular celebrity, often derived from the Eminem song about a stalker fan named Stan.',
        example: 'He\'s a total Beyoncé stan, he has all her albums and merchandise.',
        author: 'music_lover',
        date: '2017-08-22',
        upvotes: 9876,
        downvotes: 324,
        tags: ['celebrities', 'fandom', 'music']
      }
    ]
  },
  {
    id: '9',
    word: 'Gaslighting',
    definitions: [
      {
        id: '9a',
        word: 'Gaslighting',
        meaning: 'A form of psychological manipulation where a person makes someone question their own reality, memories or perceptions.',
        example: 'My ex kept telling me I was overreacting when I caught him texting other girls. Classic gaslighting.',
        author: 'psychology_buff',
        date: '2019-01-15',
        upvotes: 12453,
        downvotes: 456,
        tags: ['relationships', 'psychology', 'manipulation']
      }
    ]
  },
  {
    id: '10',
    word: 'Karen',
    definitions: [
      {
        id: '10a',
        word: 'Karen',
        meaning: 'A pejorative term for a white woman perceived as entitled or demanding beyond the scope of what is normal. The term is often portrayed as a woman with a bob cut who asks to "speak to the manager".',
        example: 'The lady threw a fit when her coupon was rejected, total Karen behavior.',
        author: 'retail_worker',
        date: '2018-09-05',
        upvotes: 15876,
        downvotes: 3421,
        tags: ['stereotype', 'entitlement', 'meme']
      }
    ]
  }
];

export const getRandomWord = (): Word => {
  const randomIndex = Math.floor(Math.random() * mockWords.length);
  return mockWords[randomIndex];
};

export const getWordOfTheDay = (): Word => {
  // In a real app, this would be based on the date
  // For now, return a fixed word for consistency
  return mockWords[0];
};

export const searchWords = (query: string): Word[] => {
  if (!query) return [];
  const lowerCaseQuery = query.toLowerCase();
  return mockWords.filter(
    word => word.word.toLowerCase().includes(lowerCaseQuery) ||
      word.definitions.some(def => 
        def.meaning.toLowerCase().includes(lowerCaseQuery) ||
        def.example.toLowerCase().includes(lowerCaseQuery)
      )
  );
};

export const getTrendingWords = (): Word[] => {
  // In a real app, this would be based on popularity
  // For now, return a slice of the mock data
  return mockWords.slice(0, 5);
};