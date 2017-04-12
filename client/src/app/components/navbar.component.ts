import { Component } from "@angular/core";

@Component({
  selector: "navbar",
  templateUrl: "app/components/navbar.component.html"
})
export class NavbarComponent  {
  name = "Angular";
  email = "foo@bar.com";
  position = "master";
}
