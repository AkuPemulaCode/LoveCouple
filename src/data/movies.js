// PixelSync mock data — using TMDB-style image placeholders
// Images from picsum.photos with consistent seeds for stable previews

export const CATEGORIES = {
  TRENDING: 'trending',
  ACTION: 'action',
  SCI_FI: 'sci-fi',
  CYBERPUNK: 'cyberpunk',
  THRILLER: 'thriller',
  ANIME: 'anime',
  DOCUMENTARY: 'documentary',
  HORROR: 'horror',
  ROMANCE: 'romance',
  COMEDY: 'comedy',
};

export const movies = [
  // TRENDING
  {
    id: 1,
    title: 'Neural Collapse',
    tagline: 'The future is already obsolete.',
    description:
      'In 2089, a rogue AI breaks free from its containment grid and begins rewriting human memories. One detective must navigate a labyrinth of false realities to find the kill switch before consciousness itself is overwritten.',
    genre: ['Sci-Fi', 'Thriller', 'Action'],
    category: [CATEGORIES.TRENDING, CATEGORIES.SCI_FI, CATEGORIES.CYBERPUNK],
    year: 2085,
    rating: 9.1,
    duration: '2h 18m',
    maturity: 'R',
    backdrop: 'https://picsum.photos/seed/neural/1280/720',
    poster: 'https://picsum.photos/seed/neural/300/450',
    video: '/videos/void-protocol.mp4',
    featured: true,
    new: true,
    top10: true,
  },
  {
    id: 2,
    title: 'Void Protocol',
    tagline: 'Some doors were never meant to be opened.',
    description:
      'A deep-space mining crew discovers an ancient signal emanating from the core of a dying star. What follows is a terrifying journey into the unknown as the line between humanity and something else begins to blur.',
    genre: ['Sci-Fi', 'Horror'],
    category: [CATEGORIES.TRENDING, CATEGORIES.SCI_FI, CATEGORIES.HORROR],
    year: 2084,
    rating: 8.7,
    duration: '1h 58m',
    maturity: 'R',
    backdrop: 'https://picsum.photos/seed/void/1280/720',
    poster: 'https://picsum.photos/seed/void/300/450',
    video: '/videos/jj1.mp4',
    featured: false,
    new: true,
    top10: true,
  },
  {
    id: 3,
    title: 'Chrome Requiem',
    tagline: 'Born human. Built to survive.',
    description:
      'A cyber-mercenary with 40% synthetic augmentations takes on one final job that spirals into a conspiracy involving the city\'s most powerful megacorp. Blood, chrome, and betrayal at every turn.',
    genre: ['Cyberpunk', 'Action'],
    category: [CATEGORIES.TRENDING, CATEGORIES.ACTION, CATEGORIES.CYBERPUNK],
    year: 2083,
    rating: 8.9,
    duration: '2h 05m',
    maturity: 'TV-MA',
    backdrop: 'https://picsum.photos/seed/chrome/1280/720',
    poster: 'https://picsum.photos/seed/chrome/300/450',
    video: '/videos/video_copy.mp4',
    featured: false,
    new: false,
    top10: true,
  },
  {
    id: 4,
    title: 'Echo Chamber',
    tagline: 'Who controls the signal, controls the world.',
    description:
      'A whistleblower exposes a government program capable of broadcasting thoughts directly into the public consciousness. With enemies everywhere and no one to trust, every second counts.',
    genre: ['Thriller', 'Drama'],
    category: [CATEGORIES.TRENDING, CATEGORIES.THRILLER],
    year: 2083,
    rating: 8.4,
    duration: '2h 01m',
    maturity: 'PG-13',
    backdrop: 'https://picsum.photos/seed/echo/1280/720',
    poster: 'https://picsum.photos/seed/echo/300/450',
    video: '/videos/jj2.mp4',
    featured: false,
    new: false,
    top10: true,
  },
  {
    id: 5,
    title: 'Phantom Grid',
    tagline: 'Every pixel hides a secret.',
    description:
      'When a legendary hacker vanishes inside a virtual reality world she built herself, her daughter must jack in and find her — navigating a world where the rules of physics are just suggestions.',
    genre: ['Sci-Fi', 'Adventure'],
    category: [CATEGORIES.TRENDING, CATEGORIES.SCI_FI],
    year: 2082,
    rating: 8.2,
    duration: '1h 52m',
    maturity: 'PG-13',
    backdrop: 'https://picsum.photos/seed/phantom/1280/720',
    poster: 'https://picsum.photos/seed/phantom/300/450',
    video: '/videos/jj3.mp4',
    featured: false,
    new: false,
    top10: true,
  },
];

// Helper functions
export const getFeaturedMovie = () => movies.find((m) => m.featured) || movies[0];

export const getMoviesByCategory = (category) =>
  movies.filter((m) => m.category.includes(category));

export const getTrending = () => getMoviesByCategory(CATEGORIES.TRENDING);

export const getTop10 = () => movies.filter((m) => m.top10).slice(0, 10);

export const getNewArrivals = () => movies.filter((m) => m.new);

export const getMovieById = (id) => movies.find((m) => m.id === Number(id));

export const rows = [
  { id: 'trending', label: 'Trending Now', movies: getTrending() },
  { id: 'top10', label: 'Top 10 on PixelSync Today', movies: getTop10() },
  { id: 'new', label: 'New Arrivals', movies: getNewArrivals() },
  { id: 'cyberpunk', label: 'Cyberpunk Universe', movies: getMoviesByCategory(CATEGORIES.CYBERPUNK) },
  { id: 'scifi', label: 'Sci-Fi Worlds', movies: getMoviesByCategory(CATEGORIES.SCI_FI) },
  { id: 'action', label: 'High-Octane Action', movies: getMoviesByCategory(CATEGORIES.ACTION) },
  { id: 'anime', label: 'Anime', movies: getMoviesByCategory(CATEGORIES.ANIME) },
  { id: 'thriller', label: 'Suspense & Thriller', movies: getMoviesByCategory(CATEGORIES.THRILLER) },
  { id: 'horror', label: 'Horror', movies: getMoviesByCategory(CATEGORIES.HORROR) },
  { id: 'documentary', label: 'Documentaries', movies: getMoviesByCategory(CATEGORIES.DOCUMENTARY) },
];
