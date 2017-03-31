var express = require('express');
var router = express.Router();
var Config = require('../app/config');
var request = require('request');
var debug = require('debug')('jira');




function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}




function performJiraCall(token, tokenSecret, url, callback, opts) {
    var jirareq = {
        url: Config.jira.baseurl + url,
        oauth: {
            consumer_key: Config.consumerKey,
            private_key: Config.consumerSecret,
            token: token,
            token_secret: tokenSecret,
            signature_method: "RSA-SHA1"
        }
    };
    if (opts) {
        jirareq = Object.assign(jirareq, opts);
    }
    debug("Requesting %o ", jirareq);
    request.get(jirareq, callback);
}

function getAllowedColumns(token, tokenSecret, filterId, callback) {
    performJiraCall(token, tokenSecret, '/rest/api/2/filter/' + filterId + '/columns', function(error, response, body) {
        if (response.statusCode === 404) {
            //Filter does not have any defined columns
            callback([]);
        } else {
            callback(JSON.parse(body));
        }
    });
}





function getAllowedFilters(token, tokenSecret, callback) {
    performJiraCall(token, tokenSecret, '/rest/api/2/filter/favourite', function(error, response, body) {
        var parsedBody = JSON.parse(body);
        var filters = [];
        for (var index in parsedBody) {
            var filter = parsedBody[index];
            filters.push(filter);
        }
        callback(filters);
    });
}


router.get('/loadcredentials', function(req, res, next) {
    getAllowedFilters(req.user.token, req.user.tokenSecret, function(filters) {
        var filters = filters.map(function(filter) {
            return {
                id: filter.id,
                name: filter.name,
                jql: filter.jql
            };

        });

        req.session.allowedFilters = filters;
    });
    res.redirect('/');
});



router.get('/filter/favourite', ensureAuthenticated, function(req, res, next) {
    getAllowedFilters(req.user.token, req.user.tokenSecret, function(filters) {
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
    getAllowedFilters(req.user.token, req.user.tokenSecret, function(filters) {
        var filter = filters.filter(function(entry) {
            return entry.id == req.params.filterid
        });
        if (filter.length > 0) {
            filter = filter[0];
            getAllowedColumns(req.user.token, req.user.tokenSecret, filter.id, function(fields) {
                var jql = filter.jql;
                var fieldlist = fields.map(function(field) {
                    return field.value
                });
                var reqobj = {
                    qs: {
                        jql: jql,
                        maxResults: 1000,
                        fields: fieldlist.join()
                    }
                };
                performJiraCall(req.user.token, req.user.tokenSecret, '/rest/api/2/search', function(error, response, body) {
                    if (req.accepts('html')) {
                        var data = JSON.parse(body);
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


                }, reqobj);
            });


        } else {
            res.status(404).send('Filter not found or not allowed current user');
        }
    });
});


module.exports = router