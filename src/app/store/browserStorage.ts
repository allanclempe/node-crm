declare const localStorage: any;
declare const document: any;

export class BrowserStorage {
  supportsLocalStorage: boolean;

  constructor() {
     this.supportsLocalStorage = this.hasLocalStorageSupport();
  }

  private hasLocalStorageSupport(): boolean {
    try {
      localStorage.setItem('_', '_');
      localStorage.removeItem('_');

      return true;
    } catch (e) {
      return false;
    }
  }

  private toExpireInXDay(days: number): string {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    return date.toUTCString();
  }

  set(name: string, value: any, days: number = 1): void {
    if (!!value) {
      value = JSON.stringify(value);
    }

    if (this.supportsLocalStorage) {
      localStorage.setItem(name, value);
    } else {
      const expireDate = this.toExpireInXDay(days);
      document.cookie = `${name}=${value};expires=${expireDate}; path=/`;
    }
  }

  get(name: string): any {
    if (this.supportsLocalStorage) {
      const result = localStorage.getItem(name);
      if (!!result) {
        return JSON.parse(result);
      }
      return null;
    }

    const nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') { c = c.substring(1, c.length); };
      if (c.indexOf(nameEQ) === 0) {
        const result = c.substring(nameEQ.length, c.length);
        switch (result) {
          case 'true':
            return true;
          case 'false':
            return false;
          default:
            return JSON.parse(result);
        }
      }
    }
  }

  del(name: string): void {
    if (this.supportsLocalStorage) {
      localStorage.removeItem(name);
    } else {
      this.set(name, '', -1);
    }
  }
}
