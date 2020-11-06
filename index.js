#!/usr/bin/env node
let minimist = require('minimist'),
    path = require('path');

let read = require('./lib/read'),
    write = require('./lib/write');


let error = (error) => {
    console.error(error);
    process.exit();
};


let args = minimist(process.argv.slice(2), {
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


let data = {
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
        let data = output.map[filename],
            file = path.join(output.path, filename);

        let js = data['js'] || null,
            scss = data['scss'] || null;

        if (js) {
            write.js(`${file}.js`, js);
        }

        if (scss) {
            write.scss(`${file}.css`, scss);
        }
    });
}).catch(error);
