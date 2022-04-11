import { Song } from "./song";

export class Album {
    #_id: string;
    #title: string;
    #year: number;
    #songs: Song[]

    constructor(id: string, title: string, year: number) {
        this.#_id = id;
        this.#title = title;
        this.#year = year;
        this.#songs = [];
    }

    get _id(): string {
        return this.#_id;    
    }
    set _id(id: string) {
        this.#_id = id;
    }
    get title(): string {
        return this.#title;    
    }
    set title(title: string) {
        this.#title = title;
    }
    get year(): number {
        return this.#year;    
    }
    set year(year: number) {
        this.#year = year;
    }
    get songs(): Song[] {
        return this.#songs;    
    }
    set songs(songs: Song[]) {
        this.#songs = songs;
    }
}

export class AlbumJSONResponse {
    #albums: Album[];

    constructor(albums: Album[]) {
        this.#albums = albums;
    }

    get albums(): Album[] {
        return this.#albums;
    }
    set albums(albums: Album[]) {
        this.#albums = albums;
    }
}
