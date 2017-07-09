import { Security } from './security';

export class Navigation {
    loggedIn: boolean;

    constructor(private security: Security) {
        this.setLoggedIn(!security.isTokenExpired());
    }

    public setLoggedIn(value: boolean): void {
        this.loggedIn = value;
    }
}