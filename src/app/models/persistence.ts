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

import * as Datastore from "nedb";
import * as Debug from "debug";


var debug = Debug("CredentialCache");

module Persistence {


    export class User {
        public userid: string;
        public name: string;
        public email: string;
        public fullName: string;
        public token: string;
        public tokenSecret: string;

        constructor(id: string, name: string, fullName: string, email: string, token: string, tokenSecret: string) {
            this.userid = id;
            this.name = name;
            this.fullName = fullName;
            this.email = email;
            this.token = token;
            this.tokenSecret = tokenSecret;
        }
    }

    interface UserFoundCallback { (user: User): void; };

    export class CredentialCache {
        private static db = new Datastore({
            filename: __dirname + "/../../../db/databasedata",
            autoload: true
        });



        public static addOrUpdateEntry(user: User) {

            var query = {
                userid: user.userid
            };
            debug("addOrUpdateEntry given user=%o query=%o", user, query);
            this.db.update(query, user, {
                upsert: true
            });
        }

        public static getEntry(userid: string, callback: UserFoundCallback) {
            debug("getEntry userid=%o", userid);
            this.db.findOne<User>({
                userid: userid
            }, function(err: Error, docs: User) {
                debug("getEntry userid=%o result=%o err=%o", userid, docs, err);
                callback(docs);
            });

        }

        public static removeEntry(userid: string) {
            this.db.remove({
                userid: userid
            });
        }

    }

}
export = Persistence;

