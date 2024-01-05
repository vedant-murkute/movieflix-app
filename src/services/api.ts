import {API_BASE_URL, API_KEY} from '../data/constants';
import {Genre, MovieState} from '../data/types';

const apiKeyParam = '&api_key=' + API_KEY;

export const fetchMovies = async (
  year: string,
  genreIds: Array<string>,
  vote_count: string = '100',
): Promise<Array<MovieState>> => {
  try {
    const genreParam =
      genreIds.length !== 0 && genreIds[0] !== '0'
        ? '&with_genres=' + genreIds.join(',')
        : '';
    const url =
      API_BASE_URL +
      'discover/movie?sort_by=popularity.desc&primary_release_year=' +
      year +
      '&vote_count.gte=' +
      vote_count +
      genreParam +
      apiKeyParam;
    console.log(url);
    const data = await fetch(url);
    const jsonData = await data.json();
    const movies: Array<MovieState> = jsonData.results.map((result: any) => ({
      id: result.title,
      title: result.title,
      posterPath: result.poster_path,
      ratings: result.vote_average,
    }));
    return movies;
  } catch (err) {
    throw new Error('Failed to fetch movies by year' + err);
  }
};

export const fetchGenres = async (): Promise<Array<Genre>> => {
  try {
    const url = API_BASE_URL + 'genre/movie/list?language=en' + apiKeyParam;
    const data = await fetch(url);
    const jsonData = await data.json();
    const genres = jsonData.genres.map((genre: any) => ({
      id: genre.id,
      name: genre.name,
      isSelected: false,
    }));
    return genres;
  } catch (err) {
    throw new Error('Failed to fetch genres: ' + err);
  }
};

export const fetchSearchMovies = async (
  query: string,
  page: number,
): Promise<{totalResults: number; movies: Array<MovieState>}> => {
  try {
    const url =
      API_BASE_URL +
      'search/movie?query=' +
      query +
      '&page=' +
      page +
      apiKeyParam;
    const data = await fetch(url);
    const jsonData = await data.json();
    const movies = jsonData.results.map((result: any) => ({
      id: result.title,
      title: result.title,
      posterPath: result.poster_path,
      ratings: result.vote_average,
    }));
    return {totalResults: jsonData.total_results, movies: movies};
  } catch (err) {
    throw new Error('Failed to search Movies: ' + err);
  }
};
