export const USER_MESSAGE_PATTERNS = {
  LOGIN: 'USER_MESSAGE_PATTERNS.LOGIN',
  LOGIN_WITH_GOOGLE: 'USER_MESSAGE_PATTERNS.LOGIN_WITH_GOOGLE',
  REGISTER: 'USER_MESSAGE_PATTERNS.REGISTER',
  GET_USER: 'USER_MESSAGE_PATTERNS.GET_USER',
  UPDATE_USER: 'USER_MESSAGE_PATTERNS.UPDATE_USER',
  USER_RESET_PASSWORD: 'USER_MESSAGE_PATTERNS.USER_RESET_PASSWORD',
  USER_ACTIVE_ACCOUNT: 'USER_MESSAGE_PATTERNS.USER_ACTIVE_ACCOUNT',
  CHECK_EMAIL_EXISTS: 'USER_MESSAGE_PATTERNS.CHECK_EMAIL_EXISTS',
  CHECK_OTP: 'USER_MESSAGE_PATTERNS.CHECK_OTP',
  GET_USER_LISTS: 'USER_MESSAGE_PATTERNS.GET_USER_LISTS',
  GET_USER_ACCOUNT: 'USER_MESSAGE_PATTERNS.GET_USER_ACCOUNT',
  CREATE_USER_BY_ADMIN: 'USER_MESSAGE_PATTERNS.CREATE_USER_BY_ADMIN',
  // PROFILE
  PROFILE: {
    LOGIN_WITH_PROFILE: 'USER_MESSAGE_PATTERNS.PROFILE.LOGIN_WITH_PROFILE',
    GET_ALL_PROFILE_BY_USER_ID:
      'USER_MESSAGE_PATTERNS.PROFILE.GET_ALL_PROFILE_BY_USER_ID',
    GET_PROFILE: 'USER_MESSAGE_PATTERNS.PROFILE.GET_PROFILE',
    CREATE_PROFILE: 'USER_MESSAGE_PATTERNS.PROFILE.CREATE_PROFILE',
    UPDATE_PROFILE: 'USER_MESSAGE_PATTERNS.PROFILE.UPDATE_PROFILE',
    DELETE_PROFILE: 'USER_MESSAGE_PATTERNS.PROFILE.DELETE_PROFILE',
  },
};

export const PAYMENT_SYSTEM_MESSAGE_PATTERN = {
  PAYMENT: {
    CREATE_PAYMENT: 'PAYMENT_SYSTEM_MESSAGE_PATTERN.PAYMENT.CREATE_PAYMENT',
    RESPONSE_THIRD_PARTY_PAYMENT:
      'PAYMENT_SYSTEM_MESSAGE_PATTERN.PAYMENT.RESPONSE_THIRD_PARTY_PAYMENT',
    GET_MY_PAYMENT: '',
  },
  PACKAGE: {
    CREATE_PACKAGE: 'PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.CREATE_PACKAGE',
    UPDATE_PACKAGE:
      'PAYMENT_SYSTEM_MESSAGE_PATTERN.PAYMENT.PACKAGE.UPDATE_PACKAGE',
    LIST_PACKAGE: 'PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.LIST_PACKAGE',
    GET_PACKAGE: 'PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.GET_PACKAGE',
    UPDATE_STATE_PACKAGE:
      'PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.UPDATE_STATE_PACKAGE',
    BULK_DELETE_PACKAGE:
      'PAYMENT_SYSTEM_MESSAGE_PATTERN.PACKAGE.BULK_DELETE_PACKAGE',
  },
};

export const MEDIAS_MESSAGE_PATTERN = {
  COMICS: {
    LIST_COMICS: 'MEDIAS_MESSAGE_PATTERN.COMICS.LIST_COMICS',
    GET_COMICS: 'MEDIAS_MESSAGE_PATTERN.COMICS.GET_COMICS',
    CREATE_COMIC: 'MEDIAS_MESSAGE_PATTERN.CREATE_COMIC',
    UPDATE_COMIC: 'MEDIAS_MESSAGE_PATTERN.UPDATE_COMIC',
    REMOVE_COMIC: 'MEDIAS_MESSAGE_PATTERN.REMOVE_COMIC',
  },
  CHAPTER: {
    LIST_CHAPTER: 'MEDIAS_MESSAGE_PATTERN.CHAPTER.LIST_CHAPTER',
    GET_CHAPTER: 'MEDIAS_MESSAGE_PATTERN.CHAPTER.GET_CHAPTER',
    CREATE_CHAPTER: 'MEDIAS_MESSAGE_PATTERN.CREATE_CHAPTER',
  },
  GENRE: {
    GET_LIST_GENRES: 'MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES',
    GET_LIST_GENRES_COMIC: 'MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES_COMIC',
    GET_LIST_GENRES_MUSIC: 'MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES_MUSIC',
    GET_LIST_GENRES_MOVIE: 'MEDIAS_MESSAGE_PATTERN.GENRE.GET_LIST_GENRES_MOVIE',
    GET_GENRE: 'MEDIAS_MESSAGE_PATTERN.GENRE.GET_GENRE',
    CREATE_GENRE: 'MEDIAS_MESSAGE_PATTERN.GENRE.CREATE_GENRE',
    UPDATE_GENRE: 'MEDIAS_MESSAGE_PATTERN.GENRE.UPDATE_GENRE',
  },
  AUTHOR: {
    GET_LIST_AUTHOR: 'MEDIAS_MESSAGE_PATTERN.AUTHOR.GET_LIST_AUTHOR',
    GET_LIST_AUTHOR_COMIC:
      'MEDIAS_MESSAGE_PATTERN.AUTHOR.GET_LIST_AUTHOR_COMIC',
    GET_LIST_AUTHOR_MUSIC:
      'MEDIAS_MESSAGE_PATTERN.AUTHOR.GET_LIST_AUTHOR_MUSIC',
    GET_LIST_AUTHOR_MOVIE:
      'MEDIAS_MESSAGE_PATTERN.AUTHOR.GET_LIST_AUTHOR_MOVIE',
    GET_AUTHOR: 'MEDIAS_MESSAGE_PATTERN.AUTHOR.GET_AUTHOR',
    CREATE_AUTHOR: 'MEDIAS_MESSAGE_PATTERN.AUTHOR.CREATE_AUTHOR',
    UPDATE_AUTHOR: 'MEDIAS_MESSAGE_PATTERN.AUTHOR.UPDATE_AUTHOR',
  },
  MUSIC: {
    GET_LIST_MUSIC: 'MEDIAS_MESSAGE_PATTERN.MUSIC.GET_LIST_MUSIC',
    GET_MUSIC: 'MEDIAS_MESSAGE_PATTERN.MUSIC.GET_MUSIC',
    CREATE_MUSIC: 'MEDIAS_MESSAGE_PATTERN.MUSIC.CREATE_MUSIC',
    UPDATE_MUSIC: 'MEDIAS_MESSAGE_PATTERN.MUSIC.UPDATE_MUSIC',
    UPDATE_URL_MUSIC: 'MEDIAS_MESSAGE_PATTERN.MUSIC.UPDATE_URL_MUSIC',
    BULK_DELETE_MUSIC: 'MEDIAS_MESSAGE_PATTERN.MUSIC.BULK_DELETE_MUSIC',
  },
  MOVIE: {
    GET_LIST_MOVIE: 'MEDIAS_MESSAGE_PATTERN.MOVIE.GET_LIST_MOVIE',
    GET_MOVIE: 'MEDIAS_MESSAGE_PATTERN.MOVIE.GET_MOVIE',
    CREATE_MOVIE: 'MEDIAS_MESSAGE_PATTERN.MOVIE.CREATE_MOVIE',
    UPDATE_MOVIE: 'MEDIAS_MESSAGE_PATTERN.MOVIE.UPDATE_MOVIE',
    UPDATE_URL_MOVIE: 'MEDIAS_MESSAGE_PATTERN.MOVIE.UPDATE_URL_MOVIE',
    BULK_DELETE_MOVIE: 'MEDIAS_MESSAGE_PATTERN.MOVIE.BULK_DELETE_MOVIE',
  },
};

export const ACTIONS_MESSAGE_PATTERN = {
  LIBRARY: {
    LIST_LIBRARY_BY_USER: 'ACTIONS_MESSAGE_PATTERN',
    CREATE_LIBRARY: 'ACTIONS_MESSAGE_PATTERN.LIBRARY.CREATE_LIBRARY',
  },

  COMMENT: {
    LIST_COMMENT: '',
  },

  HISTORY: {
    LIST_HISTORY: 'ACTIONS_MESSAGE_PATTERN.HISTORY.LIST_HISTORY',
    LOG_HISTORY: 'ACTIONS_MESSAGE_PATTERN.HISTORY.LOG_HISTORY',
  },
};
