export interface MovieState {
  id: number;
  title?: string;
  posterPath?: string;
  ratings?: number;
}

export interface Genre {
  id: number;
  name: string;
  isSelected: boolean;
}
