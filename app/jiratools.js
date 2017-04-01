var Config = require('../app/config');
var request = require('request');
var debug = require('debug')('jiratools');



function JIRA(baseurl, user) {
    var self = this;
    self.token = user.token;
    self.tokenSecret = user.tokenSecret;
    self.baseurl = baseurl;

    self.performJiraCall=function(url, callback, opts) {
        var jirareq = {
            url: baseurl + url,
            oauth: {
                consumer_key: Config.consumerKey,
                private_key: Config.consumerSecret,
                token: self.token,
                token_secret: self.tokenSecret,
                signature_method: Config.signatureMethod
            }
        };
        if (opts) {
            jirareq = Object.assign(jirareq, opts);
        }
        debug("Requesting %o ", jirareq);
        request.get(jirareq, callback);
    }



    self.getAllowedFilters = function(callback) {
        self.performJiraCall('/rest/api/2/filter/favourite', function(error, response, body) {
            debug("statuuus %o", error);
            var parsedBody = JSON.parse(body);
            var filters = [];
            for (var index in parsedBody) {
                var filter = parsedBody[index];
                filters.push(new Filter(self,filter.id, filter.name, filter.jql));
            }
            callback(filters);
        });
    }
}

function Filter(jira,id, name, jql) {
    var self = this;
    self.jira=jira;
    self.id = id;
    self.name = name;
    self.jql = jql;

    function getColumns(callback) {
        jira.performJiraCall('/rest/api/2/filter/' + self.id + '/columns', function(error, response, body) {
            if (response.statusCode === 404) {
                //Filter does not have any defined columns
                callback([]);
            } else {
                callback(JSON.parse(body));
            }
        });
    }

    self.getResult = function(maxResults, callback) {
        getColumns(function(columns) {
            var fieldlist = columns.map(function(col) {
                return col.value;
            }).join();

            var reqobj = {
                qs: {
                    jql: self.jql,
                    maxResults: maxResults,
                    fields: fieldlist
                }
            };
            jira.performJiraCall('/rest/api/2/search', function(error, response, body) {
                callback(columns,JSON.parse(body));
            }, reqobj);
        });

    }
}


var JiraTools = {
    JIRA: JIRA
};


module.exports = JiraTools;
