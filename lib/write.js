#!/usr/bin/env node
let concat = require('concat'),
    fs = require('fs'),
    sass = require('node-sass');


let error = (error) => {
    console.error(error);
    process.exit();
};

let filter = (value) => {
    if (Array.isArray(value) & value.length > 0) {
        return true;
    }

    return false;
};


// Concat Multiple JS Files
const js = (destination, files) => {
    if (!filter(files)) {
        return;
    }

    concat(files, destination, (err) => {
        if (err) {
            error(err);
        }

        process.exit();
    });
};


// Build Import List And Render
// - Done To Avoid Maintaining 'build.json' And A Seperate 'main.scss' Manifest
const scss = (destination, files) => {
    if (!filter(files)) {
        return;
    }

    let options = {
            data: files.map(file => `@import '${file}';`).join('\n'),
            file: null,
            outputStyle: 'compressed'
        };

    sass.render(options, (err, result) => {
        if (err) {
            error(err.formatted);
        }

        fs.writeFile(destination, result.css, (err) => {
            if (err) {
                error(`Error saving CSS; ${err.message}`);
            }
        });
    });
};


module.exports = { js, scss };
