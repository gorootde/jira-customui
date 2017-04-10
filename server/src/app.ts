/*!
    Copyright (C) 2017  Michael Kolb

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/// <reference path="customTypings.d.ts" />

"use strict";

import * as express from "express";
import * as path from "path";
import * as favicon from "serve-favicon";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as passport from "passport";
var session = require("cookie-session");
import * as index from "./routes/index";
import * as login from "./routes/login";
import * as jira from "./routes/jira";
import * as marked from "marked";
import * as jira2md from "jira2md";
import * as moment from "moment";
import * as indexRoute from "./routes/index";
import * as Debug from "debug";

var debug = Debug("app");




class Server {
    public app: express.Application;
    public static bootstrap(): Server {
        return new Server();
    }

    private routes() {
        this.app.use("/", index);
        this.app.use("/auth", login);
        this.app.use("/api/jira", jira);


        // catch 404 and forward to error handler
        this.app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
            var err = new Error("Not Found");
            next(err);
        });

        // error handler
        this.app.use(function(err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get("env") === "development" ? err : {};

            // render the error page
            res.status(err.status || 500);
            console.log(err);
            res.render("error", {
                error: err
            });
        });
    }

    private configLibPaths() {

        this.app.use("/js", express.static(__dirname + "/../../node_modules/bootstrap/dist/js")); // redirect bootstrap JS
        this.app.use("/js", express.static(__dirname + "/../../node_modules/jquery/dist")); // redirect JS jQuery
        this.app.use("/js", express.static(__dirname + "/../../node_modules/datatables.net/js"));
        this.app.use("/js", express.static(__dirname + "/../../node_modules/datatables.net-bs/js"));
        this.app.use("/js", express.static(__dirname + "/../../node_modules/datatables.net-colreorder/js"));
        this.app.use("/js", express.static(__dirname + "/../../node_modules/datatables.net-fixedheader/js"));

        this.app.use("/js", express.static(__dirname + "/../../node_modules/bootstrap-select/dist/js"));
        this.app.use("/css", express.static(__dirname + "/../../node_modules/bootstrap-select/dist/css"));

        this.app.use("/css", express.static(__dirname + "/../../node_modules/datatables.net-bs/css"));

        this.app.use("/css", express.static(__dirname + "/../../node_modules/datatables.net-colreorder-bs/css"));
        this.app.use("/css", express.static(__dirname + "/../../node_modules/datatables.net-fixedheader-bs/css"));
        this.app.use("/css", express.static(__dirname + "/../../node_modules/bootstrap/dist/css")); // redirect CSS bootstrap
        this.app.use("/fonts", express.static(__dirname + "/../../node_modules/bootstrap/dist/fonts")); // redirect CSS bootstrap



    }

    private config() {
        this.app.locals.md = marked.setOptions({ breaks: true });
        this.app.locals.j2md = jira2md.to_markdown;
        this.app.locals.moment = moment;

        this.app.set("views", path.join(__dirname, "../views"));
        this.app.set("view engine", "pug");

        // uncomment after placing your favicon in /public
        //this.app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
        this.app.use(logger("dev"));

        this.configLibPaths();

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, "../../public")));

        this.app.use(session({
            secret: "foobar"
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session()); // persistent login sessions



    }




    constructor() {
        this.app = express();
        this.config();
        this.routes();



        this.app.listen(3000, function() {
            console.log("Listening on port 3000");
        });

    }
}

export = Server.bootstrap().app;