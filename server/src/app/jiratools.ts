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

import * as Config from "../app/config";
import * as Request from "request";
import * as Debug from "debug";
import * as Persistence from "./models/persistence";


var debug = Debug("jiratools");

module JIRATools {

    export class JIRA {
        private self = this;
        private token: string;
        private tokenSecret: string;
        private baseurl: string;

        constructor(baseurl: string, user: Persistence.User) {
            this.token = user.token;
            this.tokenSecret = user.tokenSecret;
            this.baseurl = baseurl;
        }

        public performJiraCall(url: string, callback: Request.RequestCallback, opts?: any) {
            let jirareq = {
                url: this.baseurl + url,
                oauth: {
                    consumer_key: Config.consumerKey,
                    private_key: Config.consumerSecret,
                    token: this.token,
                    token_secret: this.tokenSecret,
                    signature_method: Config.signatureMethod
                }
            };
            if (opts) {
                jirareq = Object.assign(jirareq, opts);
            }
            debug("Requesting %o ", jirareq);
            Request.get(jirareq, callback);
        }

        public getCreateMetaData(callback: (projects: any) => void, projectKey?: string, issuetypeid?: number) {
            var reqobj = {
                qs: {
                    expand: "projects.issuetypes.fields",
                    projectKeys: projectKey,
                    issuetypeIds: issuetypeid
                }
            };


            this.performJiraCall("/rest/api/2/issue/createmeta", function(error: any, response: Request.RequestResponse, body: any) {
                var parsedBody = JSON.parse(body);
                callback(parsedBody.projects);
            }, reqobj);
        }

        public getFilter(filterid: number, callback: (filter: any) => void) {
            this.getAllowedFilters(function(filters: Array<Filter>) {
                var filter = filters.filter(function(entry: Filter) {
                    return entry.id === filterid;
                });
                callback(filter.length > 0 ? filter[0] : null);
            });
        }

        public getAllowedFilters(callback: (filters: Array<Filter>) => void) {
            var self = this;
            this.performJiraCall("/rest/api/2/filter/favourite", function(error: any, response: Request.RequestResponse, body: any) {
                var parsedBody = JSON.parse(body);
                var filters = [];
                for (let index = 0; index < parsedBody.length; index++) {
                    var filter = parsedBody[index];
                    filters.push(new Filter(self, filter.id, filter.name, filter.jql));
                }
                callback(filters);
            });
        }
    }
    export interface Column {
        value: string;
        label: string;
    }


    export class Filter {
        private jira: JIRA;
        private _id: number;
        private _name: string;
        private _jql: string;

        constructor(jira: JIRA, id: number, name: string, jql: string) {
            this.jira = jira;
            this._id = id;
            this._name = name;
            this._jql = jql;
        }
        get jql() {
            return this._jql;
        }
        get name() {
            return this._name;
        }
        get id() {
            return this._id;
        }
        public getColumns(callback: (columns: Array<Column>) => void) {
            let url = "/rest/api/2/filter/" + this.id + "/columns";
            this.jira.performJiraCall(url, function(error: any, response: Request.RequestResponse, body: any) {
                if (response.statusCode === 404) {
                    //Filter does not have any defined columns
                    callback([]);
                } else {
                    callback(JSON.parse(body));
                }
            });
        }

        public performSearch(maxResults: number, jqlPrefix: string, callback: (columns: Array<Column>, body: any) => void) {
            var self = this;
            this.getColumns(function(columns: Array<Column>) {
                var fieldlist = columns.map(function(col: Column) {
                    return col.value;
                }).join();

                var reqobj = {
                    qs: {
                        jql: (jqlPrefix ? jqlPrefix : "") + self.jql,
                        maxResults: maxResults,
                        fields: fieldlist
                    }
                };
                self.jira.performJiraCall("/rest/api/2/search", function(error: any, response: Request.RequestResponse, body: any) {
                    callback(columns, JSON.parse(body));
                }, reqobj);
            });
        }



        public getIssue(issueKey: string, callback: (fields: Array<Column>, body: any) => void) {
            this.performSearch(1, "key = " + issueKey + " AND ", function(fields: Array<Column>, result: any) {
                var issue = result.issues.length > 0 ? result.issues[0] : null;
                callback(fields, issue);
            });
        }


        public getResult(maxResults: number, callback: (columns: Array<Column>, body: any) => void) {
            this.performSearch(1000, null, callback);
        }

    }

}

export = JIRATools;
