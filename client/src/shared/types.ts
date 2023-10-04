export interface User {
  id: number;
  email: string;
  displayName: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
}

export const Statuses = {
  notStarted: 'Not Started',
  inProgress: 'In Progress',
  completed: 'Completed',
  notNeeded: 'Not Needed',
} as const;
export type IStatuses = keyof typeof Statuses;
export interface Todo {
  id: number;
  title: string;
  content: string;
  status: IStatuses;
}

export interface Event {
  id: number;
  title: string;
  content: string;
  startTime: string;
  allDay: boolean;
  notifications: boolean;
}

export type ICreateNote = Omit<Note, 'id'>;

export type ICreateTodo = Omit<Todo, 'id'>;

export type ICreateEvent = Omit<Event, 'id'>;

interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}
interface SpotifyAlbum {
  album_group: string;
  album_type: string;
  href: string;
  name: string;
  images: SpotifyImage[];
}

interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
}

export interface SpotifyCurrentlyPlayingSong {
  is_playing: boolean;
  progress_ms: number;
  item : {
    album: SpotifyAlbum;
    artists: SpotifyArtist[];
    duration_ms: number
    href: string;
    id: string;
    name: string;
    uri: string;
  }
}
