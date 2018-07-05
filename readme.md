## Installation

```
npm install git+https://github.com/esportsplus/bundle.json.git
```

## Command

SCSS Example: `bundle.json --manifest \"assets/bundle.json\" --assets scss --output \"../public/css\"`

JS Example: `bundle.json --manifest \"assets/bundle.json\" --assets js --output \"../public/js\"`

* `--assets`: The list of assets to run through the compiler (to compile multiple assets at the same time use a comma without spaces).
* `--manifest`: The primary `bundle.json` file path (relative to `package.json` directory).
* `--output`: The output directory path (relative to `package.json` directory).

## Usage

Create the primary `bundle.json` file in the asset directory of your project (for example: `project/resources/assets/bundle.json`).

Primary `bundle.json` structure:

```json
{
  "app": [
    "modules/button",
    "pages/home"
  ]
}
```

* `app`: The name used when saving the compiled file (example: `{output-directory}/app.css` or `{output-directory}/app.js`).
* `[array]`: The list of modules used by the array key.

Each module path is appended to the primary `bundle.json` directory and is used (in order) to search for the modules' `bundle.json` file (for example: `project/resources/assets/modules/button/bundle.json`).

Module `bundle.json` structure:

```json
{
  "js": [
      "js/file1.js",
      "js/file2.js"
  ],
  "scss": [
      "scss/file1.scss",
      "scss/file2.scss"
  ]
}
```

* `js` and `scss`: The array key determines the method to use when compiling the files.
* `[array]`: The list of assets to include within the compile command.

Each asset path is appended to the module and added to the compile array (for example: `project/resources/assets/modules/button/js/file1.js`)

Once all modules have been included the data is passed through the compile method to build each file.

Using the configuration listed above the following files would be created:

* `../public/css/app.css`
* `../public/js/app.js`
