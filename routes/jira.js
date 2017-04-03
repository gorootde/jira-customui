//
//     Copyright (C) 2017  Michael Kolb
//
//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <http://www.gnu.org/licenses/>.

var express = require('express');
var router = express.Router();
var Config = require('../app/config');
var request = require('request');
var debug = require('debug')('jira');
var JIRATools = require('../app/jiratools');


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


router.get('/filter/favourite', ensureAuthenticated, function(req, res, next) {
    var jira = new JIRATools.JIRA(Config.jira.baseurl, req.user);
    jira.getAllowedFilters(function(filters) {
        res.setHeader('Content-Type', 'application/json');
        res.send(filters);
    });
});


router.get('/filterresults/:filterid/issue/:issuekey', ensureAuthenticated, function(req, res, next) {
    var jira = new JIRATools.JIRA(Config.jira.baseurl, req.user);
    jira.getFilter(req.params.filterid, function(filter) {
        if (filter) {
            filter.getIssue(req.params.issuekey, function(fields, issue) {
                if (issue) {
                    res.render('issuedetails', {
                        title: Config.apptitle,
                        user: req.user,
                        data: issue,
                        fields: fields
                    });
                }
            });
        }
    });
});

router.get('/filterresults/:filterid', ensureAuthenticated, function(req, res, next) {
    var jira = new JIRATools.JIRA(Config.jira.baseurl, req.user);
    jira.getFilter(req.params.filterid, function(filter) {
        if (filter) {
            filter.getResult(1000, function(fields, data) {
                if (req.accepts('html')) {
                    res.render('filterview', {
                        title: Config.apptitle,
                        user: req.user,
                        filter: filter,
                        fields: fields,
                        data: data
                    });
                } else if (req.accepts('json')) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(response.statusCode).send(body);
                }
            });



        } else {
            res.status(404).send('Filter not found or not allowed current user');
        }
    });
});


router.get('/createissue', ensureAuthenticated, function(req, res, next) {
    var jira = new JIRATools.JIRA(Config.jira.baseurl, req.user);
    jira.getCreateMetaData(function(data) {
        res.render('createissue', {
            title: Config.apptitle,
            user: req.user,
            data: data
        });
    });

});

module.exports = router