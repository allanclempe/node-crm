import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class HttpApi extends AuthHttp {
    constructor(private url: string, options: AuthConfig, http: Http, defOpts?: RequestOptions) {
        super(options, http, defOpts);
    }

    get(endpoint: string, params?: any, options?: RequestOptions) {
        if (!options) {
            options = new RequestOptions();
        }

        // Support easy query params for GET requests
        if (params) {
            let p = new URLSearchParams();
            for (let k in params) {
                p.set(k, params[k]);
            }
            // Set the search field if we have params and don't already have
            // a search field set in options.
            options.search = !options.search && p || options.search;
        }

        return super.get(this.url + '/' + endpoint, options);
    }

    post(endpoint: string, body: any, options?: RequestOptions) {
        return super.post(this.url + '/' + endpoint, body, options);
    }

    put(endpoint: string, body: any, options?: RequestOptions) {
        return super.put(this.url + '/' + endpoint, body, options);
    }

    delete(endpoint: string, options?: RequestOptions) {
        return super.delete(this.url + '/' + endpoint, options);
    }

    patch(endpoint: string, body: any, options?: RequestOptions) {
        return super.put(this.url + '/' + endpoint, body, options);
    }

    // upload(url: string, formData: FormData): Observable<string> {

    //     return Observable.create((observer) => {

    //         const xhr: XMLHttpRequest = new XMLHttpRequest();
    //         xhr.onreadystatechange = () => {
    //             if (xhr.readyState === 4) {
    //                 if (xhr.status === 200) {
    //                     observer.next(xhr.response);
    //                 } else {
    //                     observer.error(xhr.response);
    //                 }
    //             }
    //         };

    //         xhr.open('POST', this.url + url, true);
    //         xhr.send(formData);
    //     });
    // }
}
