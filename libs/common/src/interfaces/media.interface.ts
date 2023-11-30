import { Author } from '../entities/medias/author.entity';
import { Genre } from '../entities/medias/genre.entity';
import { ETypeMedia } from '../enums/media.enum';

export interface IPrepareMediaDataOptions {
  genre_ids?: number[];
  author_ids?: number[];
  type?: ETypeMedia;
}

export interface IPrepareMediaData {
  genres: Genre[];
  authors: Author[];
}
