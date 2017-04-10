module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        ts: {
            app: {
                files: [{
                    "server/runtime": [
                        "server/src/**/*.ts",
                        "!src/.baseDir.ts",
                        "!node_modules/**/*",
                        "!src/_all.d.ts",
                        "!client/**/*"
                    ]
                }],
                tsconfig: true
            },
            client: {
                files: [{
                    "client/runtime": [
                        "client/src/**/*.ts"
                    ]
                }],
                tsconfig: true
            }
        },
        copy: {
            client: {
                files: [{
                    expand: true,
                    cwd: "client/src",
                    src: ['**/*.html'],
                    dest: 'client/runtime',
                    filter: 'isFile'
                }],
            },
        },
        tslint: {
            options: {
                configuration: "tslint.json"
            },
            files: {
                src: ["server/src/**/*.ts"]
            }
        },
        watch: {
            ts: {
                files: ["server/src/**/*.ts"],
                tasks: ["ts", "tslint"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");

    grunt.registerTask("default", [
        "ts",
        "copy",
        "tslint"
    ]);

};