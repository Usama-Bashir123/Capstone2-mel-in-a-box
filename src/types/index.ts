// ─── User / Auth ────────────────────────────────────────────────────────────

export type UserRole = "admin" | "parent" | "child";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Child {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  parentId: string;
  characterId?: string;
  createdAt: string;
}

// ─── Stories ────────────────────────────────────────────────────────────────

export interface Story {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  duration: number; // minutes
  isLocked: boolean;
  isPremium: boolean;
  progress?: number; // 0-100
}

// ─── Games ──────────────────────────────────────────────────────────────────

export interface Game {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  isLocked: boolean;
  isPremium: boolean;
}

// ─── Rewards & Badges ───────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  isEarned: boolean;
  isLocked: boolean;
  earnedAt?: string;
}

export interface Award {
  id: string;
  title: string;
  image: string;
  earnedAt: string;
}

// ─── Party Themes ───────────────────────────────────────────────────────────

export interface PartyTheme {
  id: string;
  name: string;
  thumbnail: string;
  isLocked: boolean;
  isPremium: boolean;
}

// ─── Shop ───────────────────────────────────────────────────────────────────

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

export interface CartItem extends ShopItem {
  quantity: number;
}

// ─── Characters ─────────────────────────────────────────────────────────────

export interface Character {
  id: string;
  name: string;
  image: string;
  isSelected: boolean;
}

// ─── API Response wrapper ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
