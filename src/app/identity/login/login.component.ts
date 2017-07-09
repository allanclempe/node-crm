import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IdentityService } from '../identity.service';
import { Router } from '@angular/router';
import { Security } from '../../shared/infrastructure/security';

@Component({
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {

    form: FormGroup;

    constructor(private fb: FormBuilder,
        private identityService: IdentityService,
        private security: Security,
        private router: Router) {
        this.form = this.fb.group({
            email: ['demo@node-crm.com', [Validators.required, Validators.email]],
            password: ['demo_password', Validators.required]
        });
    }

    ngOnInit() {

    }

    public login(model: any, valid: boolean) {
        if (!valid) {
            return;
        }
        this.identityService.login(model.email, model.password).subscribe(response => {
            this.security.setToken(response.token);
            this.router.navigate(['identity/dashboard']);
        });
    }
}