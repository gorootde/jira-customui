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

var Config = require('../app/config');
var request = require('request');
var debug = require('debug')('jiratools');



function JIRA(baseurl, user) {
    var self = this;
    self.token = user.token;
    self.tokenSecret = user.tokenSecret;
    self.baseurl = baseurl;

    self.performJiraCall = function(url, callback, opts) {
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

    self.getCreateMetaData = function(callback) {
        var reqobj = {
            qs: {
                expand: "project.issuetypes.fields"
            }
        };
        self.performJiraCall('/rest/api/2/issue/createmeta', function(error, response, body) {
          var parsedBody=JSON.parse(body);
          callback(parsedBody.projects);
        }, reqobj);
    }

    self.getFilter = function(filterid, callback) {
        self.getAllowedFilters(function(filters) {
            var filter = filters.filter(function(entry) {
                return entry.id == filterid;
            });
            callback(filter.length > 0 ? filter[0] : null);
        });
    }

    self.getAllowedFilters = function(callback) {
        self.performJiraCall('/rest/api/2/filter/favourite', function(error, response, body) {
            debug("statuuus %o", error);
            var parsedBody = JSON.parse(body);
            var filters = [];
            for (var index in parsedBody) {
                var filter = parsedBody[index];
                filters.push(new Filter(self, filter.id, filter.name, filter.jql));
            }
            callback(filters);
        });
    }
}

function Filter(jira, id, name, jql) {
    var self = this;
    self.jira = jira;
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

    function performSearch(maxResults, jqlPrefix, callback) {
        getColumns(function(columns) {
            var fieldlist = columns.map(function(col) {
                return col.value;
            }).join();

            var reqobj = {
                qs: {
                    jql: (jqlPrefix ? jqlPrefix : "") + self.jql,
                    maxResults: maxResults,
                    fields: fieldlist
                }
            };
            jira.performJiraCall('/rest/api/2/search', function(error, response, body) {
                callback(columns, JSON.parse(body));
            }, reqobj);
        });
    }
    self.getIssue = function(issueKey, callback) {
        performSearch(1, "key = " + issueKey + " AND ", function(fields, result) {
            var issue = result.issues.length > 0 ? result.issues[0] : null;
            callback(fields, issue);
        });
    }


    self.getResult = function(maxResults, callback) {
        performSearch(1000, null, callback);
    }
}



var JiraTools = {
    JIRA: JIRA
};


module.exports = JiraTools;