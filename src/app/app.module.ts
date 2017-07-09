import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, } from '@angular/http';
import { AuthConfig, JwtHelper } from 'angular2-jwt';
import { AppComponent } from './app.component';
import { routing } from './app.router';
import { SharedModule } from './shared/shared.module';
import { IdentityService } from './identity/identity.service';
import { HttpApi } from './shared/infrastructure/httpApi';
import { environment } from '../environments/environment';
import { Security } from './shared/infrastructure/security';

export function authHttpServiceFactory(http: Http, options: RequestOptions, security: Security) {

  const authConfig = new AuthConfig({
    tokenGetter: () => security.getToken(),
    noJwtError: true,
    globalHeaders: [{ 'Content-Type': 'application/json' }],
  });

  return new HttpApi(environment.baseUri, authConfig, http, options);
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    FormsModule,
    HttpModule,
    routing,
  ],
  providers: [
    IdentityService,
    Security,
    JwtHelper,
    { provide: HttpApi, useFactory: authHttpServiceFactory, deps: [Http, RequestOptions, Security] },
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {}
