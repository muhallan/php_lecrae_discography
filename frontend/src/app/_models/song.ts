export class Song {
    #_id: string;
    #name: string;
    #writers: string[]

    constructor(id: string, name: string, writers: string[]) {
        this.#_id = id;
        this.#name = name;
        this.#writers = writers;
    }

    get _id(): string {
        return this.#_id;    
    }
    set _id(id: string) {
        this.#_id = id;
    }
    get name(): string {
        return this.#name;    
    }
    set name(name: string) {
        this.#name = name;
    }
    get writers(): string[] {
        return this.#writers;    
    }
    set writers(writers: string[]) {
        this.#writers = writers;
    }
}
