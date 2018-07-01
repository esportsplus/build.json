#!/usr/bin/env node
var fs = require('fs-extra'),
    Promise = require('promise');


const MANIFEST_FILENAME = 'build.json';


var error = (error) => {
    console.error(error);
    process.exit();
};

var toArray = (value) => {
    if (value && !Array.isArray(value)) {
        value = [value];
    }

    return value;
};


var load = (args) => {
    return fs.readJson(args.manifest).then((json) => {
        let p = new Promise(resolve => resolve(args));

        if (!json) {
            error(`Build list was not found manifest: ${args.manifest}`);
        }

        // Build Full Paths
        // - Json Keys = Bundled File Name
        // - Loop Through Assets And Save Within 'data.map' For 'output' Promise
        Object.keys(json).forEach((filename) => {

            // Create Output Container
            args.output.map[filename] = {};

            // ^ Add Asset Containers - css, js, etc.
            args.assets.forEach((key) => {
                args.output.map[filename][key] = [];
            });

            toArray(json[filename]).forEach((asset) => {
                p = p.then((data) => {
                    let path = `${data.directory}/${asset}`;

                    return fs.readJson(`${path}/${MANIFEST_FILENAME}`).then((json) => {
                        data.assets.forEach((key) => {
                            let files = json[key] || null;

                            if (files) {
                                data.output.map[filename][key] = data.output.map[filename][key].concat(
                                    toArray(files).map(file => `${path}/${file}`)
                                );
                            }
                        });

                        return data;
                    }).catch(error);
                });
            });
        });

        return p;
    }).catch(error);
};


// Return Output Data Only
var output = (args) => {
    return new Promise(resolve => resolve(args.output)).catch(error);
};


module.exports = {
    manifest: (args) => {
        return load(args).then(output);
    }
};
