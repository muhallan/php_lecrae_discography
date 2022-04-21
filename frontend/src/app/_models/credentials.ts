export class Credentials {
    username: string;
    name: string;
    password: string
    confirmPassword: string;

    constructor(username: string, name: string, password: string, confirmPassword: string) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}