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
    res.render('issuedetails', {
        user: req.user,
        data: req.query.data,
        fields: req.query.fields
    });
});

router.get('/filterresults/:filterid', ensureAuthenticated, function(req, res, next) {
    var jira = new JIRATools.JIRA(Config.jira.baseurl, req.user);
    jira.getAllowedFilters(function(filters) {
        var filter = filters.filter(function(entry) {
            return entry.id == req.params.filterid
        });
        if (filter.length > 0) {
            filter = filter[0];
            filter.getResult(1000,function(fields,data) {
                if (req.accepts('html')) {
                    res.render('filterview', {
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


module.exports = router
