import type { TravelPackage } from "../types/travel";

export const PACKAGES: TravelPackage[] = [
  {
    id: 1,
    title: "Greek Islands Discovery",
    destination: "Santorini & Mykonos",
    image:
      "https://images.unsplash.com/photo-1563789031959-4c02bcb41319?w=900&h=560&fit=crop&auto=format",
    duration: "10 Days",
    groupSize: "2–12",
    price: 3490,
    originalPrice: 4200,
    rating: 4.9,
    reviews: 341,
    includes: [
      "5-star hotel",
      "Daily breakfast",
      "Island hopping",
      "Guided tours",
      "Airport transfers",
    ],
    highlights:
      "Caldera sunsets, volcanic beaches, authentic taverna dining, and ancient ruins.",
    category: "Luxury",
  },
  {
    id: 2,
    title: "Bali Spirit Journey",
    destination: "Ubud & Seminyak",
    image:
      "https://images.unsplash.com/photo-1589632732202-bd154e6e116d?w=900&h=560&fit=crop&auto=format",
    duration: "8 Days",
    groupSize: "2–8",
    price: 2190,
    originalPrice: 2800,
    rating: 4.8,
    reviews: 512,
    includes: [
      "Boutique villa",
      "Yoga sessions",
      "Rice terrace trekking",
      "Temple visits",
      "Spa treatments",
    ],
    highlights:
      "Sacred temples, terraced rice paddies, traditional dance performances, and healing rituals.",
    category: "Wellness",
  },
  {
    id: 3,
    title: "Japan in Full Bloom",
    destination: "Tokyo, Kyoto & Osaka",
    image:
      "https://images.unsplash.com/photo-1557409518-691ebcd96038?w=900&h=560&fit=crop&auto=format",
    duration: "14 Days",
    groupSize: "2–10",
    price: 4850,
    originalPrice: 5600,
    rating: 4.9,
    reviews: 228,
    includes: [
      "Ryokan & hotel mix",
      "JR Rail Pass",
      "Tea ceremony",
      "Shinkansen rides",
      "Expert guide",
    ],
    highlights:
      "Cherry blossoms, samurai history, street food markets, futuristic cities, and tranquil temples.",
    category: "Cultural",
  },
];
