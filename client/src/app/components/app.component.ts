import { Component } from "@angular/core";

@Component({
    selector: "my-app",
    template: `<navbar></navbar>`,
})
export class AppComponent {
    name = "Angular";
    email = "foo@bar.com";
    position = "master";
}
