import { Story, Game, Badge, Award } from "@/types";

export const mockDashboardData = {
  child: {
    name: "Mia",
    greeting: "Hello, Mia! 👋",
    subtitle: "Ready for a new adventure today?",
    heroSubtitle: "Keep going! You're doing amazing today!",
  },
  activeStory: {
    id: "1",
    title: "Underwater Kingdom",
    thumbnail: "/images/child/story-underwater.png",
    progress: 50,
    lastRead: "2 hrs ago",
  },
  goals: [
    { id: "1", label: 'Play the "Match the Letters" game', done: true },
    { id: "2", label: "Play 1 game", done: true },
    { id: "3", label: "Earn 1 star", done: true },
    { id: "4", label: 'Play the "Match the Letters" game', done: false },
  ],
  activities: [
    { id: "1", text: "Earned 1 star — Jungle Counting Game" },
    { id: "2", text: "Read Pirate Island Adventure — Page 4" },
    { id: "3", text: 'Earned "Counting Star" badge' },
    { id: "4", text: 'Earned "Counting Star" badge' },
  ],
  recommendedStories: [
    {
      id: "2",
      title: "The Magic Forest",
      thumbnail: "/images/child/story-forest.png",
      category: "Adventure",
      duration: 15,
      isLocked: false,
      isPremium: false,
    },
    {
      id: "3",
      title: "Space Journey",
      thumbnail: "/images/child/story-space.png",
      category: "Sci-Fi",
      duration: 20,
      isLocked: true,
      isPremium: true,
    },
  ] as Story[],
};
