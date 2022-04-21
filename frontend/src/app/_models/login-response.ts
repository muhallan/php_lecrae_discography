export class LoginResponse {
    #message: string;
    #token: string;

    constructor(message: string, token: string) {
        this.#message = message;
        this.#token = token;
    }

    get message(): string {
        return this.#message;    
    }
    set message(message: string) {
        this.#message = message;
    }
    get token(): string {
        return this.#token;    
    }
    set token(token: string) {
        this.#token = token;
    }
}
