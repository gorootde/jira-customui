var Config = require('../app/config');
var request = require('request');
var debug = require('debug')('jiratools');

var JiraTools={}
JiraTools.performJiraCall=function(token, tokenSecret, url, callback, opts) {
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

JiraTools.getAllowedColumns=function(token, tokenSecret, filterId, callback) {
    performJiraCall(token, tokenSecret, '/rest/api/2/filter/' + filterId + '/columns', function(error, response, body) {
        if (response.statusCode === 404) {
            //Filter does not have any defined columns
            callback([]);
        } else {
            callback(JSON.parse(body));
        }
    });
}

JiraTools.getAllowedFilters=function(token, tokenSecret, callback) {
    performJiraCall(token, tokenSecret, '/rest/api/2/filter/favourite', function(error, response, body) {
        debug("statuuus %o", error);
        var parsedBody = JSON.parse(body);
        var filters = [];
        for (var index in parsedBody) {
            var filter = parsedBody[index];
            filters.push(filter);
        }
        callback(filters);
    });
}

/**
 * Determine if an issue is included in the given filter AND the filter is allowed for this user
 */
JiraTools.isIssueIncluded=function(token, tokenSecret, filterId, issueKey, callback) {
    getAllowedFilters(req.user.token, req.user.tokenSecret, function(filters) {
        var filter = filters.filter(function(entry) {
            return entry.id == req.params.filterid
        });

    });
}


module.exports=JiraTools;