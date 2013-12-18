# grunt-scorm-manifest

> A grung plugin that generates a valid SCORM IMS manifest file.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-scorm-manifest --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-scorm-manifest');
```

## The "scorm_manifest" task

_Run this task with the `grunt scorm_manifest` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

Node Libraries Used:
[xmlbuilder-js](https://github.com/oozcitak/xmlbuilder-js) (for xml generation).

### Config

In your project's Gruntfile, add a section named `scorm_manifest` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  scorm_manifest: {
    your_target: {
		options: {
		  // Options go here
		},
		files: {
		  // File declaration goes here
		},
	},
  },
});
```

### Options

#### options.version
Type: `String`
Default value: `'2004'`
Possible values: `2004||1.2`

This is used to define which version of SCORM will be applied to the manifest.

#### options.courseId
Type: `String`
Default value: `'CourseID'`

This is used to define the top-level course ID.

#### options.SCOtitle
Type: `String`
Default value: `'SCO Title'`

This is used (by `<organization />`) to define the SCO title.

#### options.moduleTitle
Type: `String`
Default value: `'Module'`

This is used (by `<item />`) to define the SCO module title.

#### options.launchPage
Type: `String`
Default value: `'index.html'`

This is used to define the launchpage of the SCO.

#### options.path
Type: `String`
Default value: `'./'`

This is used to define the path to which `imsmanifest.xml` will be written.

### Usage Example

This example creates a SCORM 2004 3rd Edition IMS manifest. The manifest will be written to the project directory and will include files in the project directory and all subdirectories.

```js
// simple single SCO package
scorm_manifest: {
	options: {
		version: '2004',
		courseId: 'GRUNT101',
		SCOtitle: 'Intro to Grunt',
		moduleTitle: 'AU101',
		launchPage: 'the_launchpage.html',
		path: './'
	},
	files: [{
				expand: true,	 	// required
				cwd: './', 			// start looking for files to list in the same dir as Gruntfile 
				src: ['**/*.*'], 	// file selector (this example includes subdirectories)
				filter: 'isFile'	// required
			}],
},
```

## Release History
  * 2013-12-18   v0.2.0   Initial plugin release.