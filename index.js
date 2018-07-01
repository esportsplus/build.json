#!/usr/bin/env node
var minimist = require('minimist'),
    path = require('path');

var read = require('./lib/read'),
    write = require('./lib/write');


var error = (error) => {
    console.error(error);
    process.exit();
};


var args = minimist(process.argv.slice(2), {
        alias: {
            a: 'assets',
            m: 'manifest',
            o: 'output'
        },
        options: {
            boolean: true
        }
    }),
    missing = [];


if (!args.m || null) {
    missing.push('-manifest');
}

if (!args.a || null) {
    missing.push('-assets');
}

if (!args.o || null) {
    missing.push('-output');
}

if (missing.length > 0) {
    error(`Required parameter(s) '${missing.join("','")}' missing!`);
}


var data = {
        assets: args.a.split(','),
        directory: path.parse(args.m).dir,
        manifest: args.m,
        output: {
            map:  {},
            path: args.o
        }
    };

read.manifest(data).then((output) => {
    Object.keys(output.map).forEach((filename) => {
        var data = output.map[filename],
            file = path.join(output.path, filename);

        var js = data['js'] || null,
            scss = data['scss'] || null;

        if (js) {
            write.js(`${file}.js`, js);
        }

        if (scss) {
            write.scss(`${file}.css`, scss);
        }
    });
}).catch(error);
