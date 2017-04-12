import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent }  from "./components/app.component";
import { NavbarComponent } from "./components/navbar.component";
import { LoginformComponent } from "./components/loginform.component";

import { AuthenticationService } from "./services/authentication.service";

@NgModule({
    imports: [BrowserModule, CommonModule, FormsModule, HttpModule],
    declarations: [AppComponent, NavbarComponent, LoginformComponent],
    bootstrap: [AppComponent],
    providers: [AuthenticationService]
})
export class AppModule { }
