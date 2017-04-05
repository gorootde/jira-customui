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
/// <reference types="passport" />


import * as Express from "express";
var router = Express.Router();
import * as Config from "../app/config";
import * as Request from "request";
import * as Debug from "debug";
var debug = Debug("jira");
import * as JIRATools from "../app/jiratools";





function ensureAuthenticated(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

router.get("/filter/favourite", ensureAuthenticated, function(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    var jira = new JIRATools.JIRA(Config.jira.baseurl, req.user);
    jira.getAllowedFilters(function(filters: Array<JIRATools.Filter>) {
        res.setHeader("Content-Type", "application/json");
        res.send(filters);
    });
});

function getIssue(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    var jira = new JIRATools.JIRA(Config.jira.baseurl, req.user);
    jira.getFilter(req.params.filterid, function(filter: JIRATools.Filter) {
        if (filter) {
            filter.getIssue(req.params.issuekey, function(fields: Array<JIRATools.Column>, issue: any) {
                if (issue) {
                    res.render("issuedetails", {
                        title: Config.apptitle,
                        user: req.user,
                        data: issue,
                        fields: fields
                    });
                }
            });
        }
    });
}

router.get("/filterresults/:filterid/issue/:issuekey", ensureAuthenticated, getIssue);

router.get("/filterresults/:filterid", ensureAuthenticated, function(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    var jira = new JIRATools.JIRA(Config.jira.baseurl, req.user);
    jira.getFilter(req.params.filterid, function(filter: JIRATools.Filter) {
        if (filter) {
            filter.getResult(1000, function(fields: Array<JIRATools.Column>, data: any) {
                if (req.accepts("html")) {
                    res.render("filterview", {
                        title: Config.apptitle,
                        user: req.user,
                        filter: filter,
                        fields: fields,
                        data: data
                    });
                }
            });



        } else {
            res.status(404).send("Filter not found or not allowed current user");
        }
    });
});


router.get("/issue", ensureAuthenticated, function(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    var jira = new JIRATools.JIRA(Config.jira.baseurl, req.user);
    jira.getCreateMetaData(function(data: any) {
        res.render("createissue", {
            title: Config.apptitle,
            user: req.user,
            data: data
        });
    });

});

export = router;