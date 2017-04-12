import { Injectable, Inject } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {


    constructor( @Inject(Http) private http: Http) {

    }

    authenticate(username: string, password: string) {
        console.log("AUTHENTICATIONSERVICE! " + username);
        var result = this.http.post("/api/auth", JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                console.log(response);
                let user = response.json();
                if (user && user.token) {
                    console.log("AUTHENTICATED " + user);
                }
            });
        console.log("AUTHENTICATIONSERVICE result is ", result);
        return result;
    }

}
