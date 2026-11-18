// Dummy blog posts until the client sends real articles. Every word is lorem ipsum.

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string; // ISO date
  readMinutes: number;
  image: string;
  alt: string;
  excerpt: string;
  body: { heading?: string; text: string }[];
};

const para =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Maecenas faucibus mollis interdum, cras mattis consectetur purus sit amet fermentum.";
const para2 =
  "Sed posuere consectetur est at lobortis. Aenean lacinia bibendum nulla sed consectetur. Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod, donec sed odio dui.";

const body = [
  { text: para },
  { heading: "Lorem ipsum dolor sit amet", text: para2 },
  { text: para },
  { heading: "Consectetur adipiscing elit", text: para2 },
  { text: para },
];

export const posts: Post[] = [
  { slug: "lorem-ipsum-villa-living", title: "Lorem ipsum: what villa living really means", category: "Lifestyle", date: "2026-11-10", readMinutes: 5, image: "/images/night-villa-warm.jpg", alt: "Villa with warm lights over a pool", excerpt: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", body },
  { slug: "dolor-sit-amet-private-pools", title: "Dolor sit amet: designing around a private pool", category: "Design", date: "2026-10-28", readMinutes: 4, image: "/images/night-courtyard-pool.jpg", alt: "Courtyard pool lit at night", excerpt: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.", body },
  { slug: "consectetur-clubhouse-guide", title: "Consectetur: a floor-by-floor clubhouse guide", category: "Amenities", date: "2026-10-14", readMinutes: 6, image: "/images/night-resort-pool.jpg", alt: "Clubhouse pool lit among palms", excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.", body },
  { slug: "adipiscing-location-advantages", title: "Adipiscing elit: why the location matters", category: "Location", date: "2026-09-30", readMinutes: 4, image: "/images/dusk-villa-sky.jpg", alt: "Villa at dusk under a coloured sky", excerpt: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.", body },
  { slug: "sed-do-eiusmod-interiors", title: "Sed do eiusmod: warm interiors for every season", category: "Design", date: "2026-09-12", readMinutes: 5, image: "/images/interior-warm-lounge.jpg", alt: "Warm lounge with a fireplace", excerpt: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.", body },
  { slug: "tempor-incididunt-buying-guide", title: "Tempor incididunt: a first-time villa buyer's guide", category: "Guides", date: "2026-08-25", readMinutes: 7, image: "/images/night-villa-glass.jpg", alt: "Villa with a glass gable lit at night", excerpt: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.", body },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
