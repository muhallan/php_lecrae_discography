export class User {
    #_id: string;
    #username: string;
    #name: string;
    #password: string

    constructor(id: string, username: string, name: string, password: string) {
        this.#_id = id;
        this.#username = username;
        this.#name = name;
        this.#password = password;
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
    get username(): string {
        return this.#username;    
    }
    set username(username: string) {
        this.#username = username;
    }
    get password(): string {
        return this.#password;    
    }
    set password(password: string) {
        this.#password = password;
    }
}
