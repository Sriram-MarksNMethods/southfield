// One place for the site aerial and its points, shared by the Home scroll
// teaser (AerialMap) and the full-screen 3D explorer (/explore).
// Positions are % of the photo (x from the left, y from the top).
// The photo is a free Unsplash placeholder (photo-1776723670896) until the
// client's drone shot or site plan arrives.

export const aerial = { src: "/images/aerial-golf-4k.jpg", width: 4000, height: 2707 };

export type Stop = { name: string; x: number; y: number; src: string; alt: string; text: string; href: string | null };

export const stops: Stop[] = [
  { name: "The Villas", x: 25, y: 55, src: "/images/night-villa-warm.jpg", alt: "Villa with warm lights over a pool", text: "Lorem ipsum dolor sit amet, 120 private villas set among palms, each with its own pool and garden court.", href: null },
  { name: "The Clubhouse", x: 64, y: 30, src: "/images/night-resort-pool.jpg", alt: "Clubhouse pool lit among palms", text: "A G+3 clubhouse with a pool, spa and sky lounge, consectetur adipiscing elit, sed do eiusmod tempor.", href: "/specifications" },
  { name: "The Greens", x: 79, y: 28, src: "/images/night-garden-pool.jpg", alt: "Garden pool among palms at night", text: "Open greens and tree-lined walks, ut enim ad minim veniam, quis nostrud exercitation.", href: "/about" },
];

export const spots = [
  { name: "Driving range", x: 45, y: 20 },
  { name: "Garden walk", x: 20, y: 30 },
  { name: "Pavilion", x: 72, y: 72 },
  { name: "Putting green", x: 10, y: 66 },
  { name: "Jogging track", x: 57, y: 62 },
];
