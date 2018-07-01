## Installation

```
npm install git+https://github.com/esportsplus/build-json.git
```

## Command

SCSS Example: `build-json --manifest \"assets/build.json\" --assets scss --output \"../public/css\"`

JS Example: `build-json --manifest \"assets/build.json\" --assets js --output \"../public/js\"`

* `--assets`: Determines the asset to compile. (to compile multiple use a `,` without spaces)
* `--manifest`: Path to primary `build.json` file (relative to `package.json` directory)
* `--output`: Path to output directory (relative to `package.json` directory)

## Usage

Create a `build.json` file in the asset directory of your project (for example: `my-project/resources/assets/build.json`)

This file acts as the asset manifest and contains a list of modules to run through the compiler in the order provided. For example:

```json
{
  "app": [
    "modules/button",
    "pages/home"
  ]
}
```

The content of the primary `build.json` file is read and looped through to search for each modules' `build.json` file.

* `app`: The filename to use when saving the compiled file.
* _array list_: The list of modules to compile.

Each relative module path is appended to the primary `build.json` path and the file is read (for example: `my-project/resources/assets/modules/button/build.json`)

_When a `build.json` file is not found an error is thrown_

Module `build.json` structure:

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

* `js` and `scss`: Determine the method to use when compiling the files.
* _array list_: The list of assets to include within the compile command.

Each relative asset path is appended to the module and added to a compile array (for example: `my-project/resources/assets/modules/button/js/file1.js`)

_Relative paths are used throughout the build process to enable custom directory structure for any project_

Once all modules have been included the data is passed through the compile method to build each file

Following the `json` configuration listed above the following files would be created

* `../public/css/app.css`
* `../public/js/app.js`
