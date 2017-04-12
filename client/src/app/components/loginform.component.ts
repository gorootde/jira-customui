import { Component, Inject } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";


@Component({
    selector: "loginform",
    templateUrl: "app/components/loginform.component.html"
})
export class LoginformComponent {
    username = undefined;
    password = undefined;
    authenticated = false;

    constructor( @Inject(AuthenticationService) private authService: AuthenticationService) { }

    performLogin(value: any) {
      console.log(value);
        this.authService.authenticate(value.user, value.password);

    }

    isLoggedIn() {
        return this.authenticated;
    }

}
