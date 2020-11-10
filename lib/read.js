#!/usr/bin/env node
let fs = require('fs-extra'),
    Path = require('path'),
    Promise = require('promise');


const DEFAULT_FILENAME = 'bundle.json';


let toArray = (value) => {
    if (value && !Array.isArray(value)) {
        value = [value];
    }

    return value;
};


const read = {
    bundle: (data, filename, path) => {
        if (fs.lstatSync(path).isDirectory()) {
            path = `${path}/${DEFAULT_FILENAME}`;
        }

        let directory = Path.dirname(path),
            json = JSON.parse(fs.readFileSync(path, 'utf8'));

        // Bundling Subfolders
        if (Array.isArray(json)) {
            json.forEach((subdirectory) => {
                data = read.bundle(data, filename, `${directory}/${subdirectory}`);
            });
        }
        // Bundle Asset List
        else {
            data.assets.forEach((key) => {
                let files = (json[key] || null),
                    filepath = (json.filepath || {})[key] || '';

                if (files) {
                    data.output.map[filename][key] = data.output.map[filename][key].concat(
                        toArray(files).map((file) => {
                            let path = `${directory}/${file}`;

                            if (filepath) {
                                path = `${path}/${filepath}`;
                            }

                            return path;
                        })
                    );
                }
            });
        }

        return data;
    },
    manifest: (data) => {
        let json = JSON.parse(fs.readFileSync(data.manifest, 'utf8'));

        if (!json) {
            console.error(`Build list was not found manifest: ${data.manifest}`);
            process.exit();
        }

        // Build Full Paths
        // - Json Keys = Bundled File Name
        // - Loop Through Assets And Save Within 'data.map' For 'output' Promise
        Object.keys(json).forEach((filename) => {

            // Create Output Container
            data.output.map[filename] = {};

            // ^ Add Asset Containers - css, js, etc.
            data.assets.forEach((key) => {
                data.output.map[filename][key] = [];
            });

            toArray(json[filename]).forEach((asset) => {
                data = read.bundle(data, filename, `${data.directory}/${asset}`);
            });
        });

        return data.output;
    }
};


module.exports = {
    manifest: (args) => {
        return new Promise(resolve => resolve( read.manifest(args) ));
    }
};
