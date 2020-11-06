#!/usr/bin/env node
var fs = require('fs-extra'),
    Promise = require('promise');


const DEFAULT_FILENAME = 'bundle.json';


var toArray = (value) => {
    if (value && !Array.isArray(value)) {
        value = [value];
    }

    return value;
};


var read = {
    bundle: (data, filename, path) => {
        var directory = path;
		
		if (fs.lstatSync(path).isDirectory()) {
			path = `${path}/${DEFAULT_FILENAME}`;
		}
		else {
			directory = Path.dirname(path);
		}
            
        var json = JSON.parse(fs.readFileSync(path, 'utf8'));

        // Bundle Is A Manifest Linking To The Modules/Subdirectories Within
        // It's Directory
        if (Array.isArray(json)) {
            json.forEach((subdirectory) => {
                data = read.bundle(data, filename, `${path}/${subdirectory}`);
            });
        }
        // Bundle Includes Asset Lists
        else {
            data.assets.forEach((key) => {
                let files = json[key] || null;

                if (files) {
                    data.output.map[filename][key] = data.output.map[filename][key].concat(
                        toArray(files).map(file => `${path}/${file}`)
                    );
                }
            });
        }

        return data;
    },
    manifest: (data) => {
        var json = JSON.parse(fs.readFileSync(data.manifest, 'utf8'));

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
