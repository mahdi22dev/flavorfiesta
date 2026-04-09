export interface Recipe {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  coverImage: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
