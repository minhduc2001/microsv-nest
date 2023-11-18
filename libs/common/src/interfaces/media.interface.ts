import { Author } from '../entities/medias/author.entity';
import { Genre } from '../entities/medias/genre.entity';

export interface IPrepareMediaDataOptions {
  genre_ids?: number[];
  author_ids?: number[];
}

export interface IPrepareMediaData {
  genres: Genre[];
  authors: Author[];
}
