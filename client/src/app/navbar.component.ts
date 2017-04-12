import { Component } from '@angular/core';

@Component({
  restrict: 'E',
  selector: 'navbar',
  templateUrl: "navbar.component.html"
})
export class NavbarComponent  {
  name = 'Angular';
  email = 'foo@bar.com';
  position = 'master';
}
