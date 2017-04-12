import { NgModule }      from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";

import { AppComponent }  from "./components/app.component";
import {NavbarComponent} from "./components/navbar.component";
import {LoginformComponent} from "./components/loginform.component";

@NgModule({
    imports: [BrowserModule, CommonModule],
    declarations: [AppComponent, NavbarComponent, LoginformComponent],
    bootstrap: [AppComponent, NavbarComponent, LoginformComponent]
})
export class AppModule { }
