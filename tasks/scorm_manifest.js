/*
 * grunt-scorm-manifest
 * https://github.com/raygesualdo/grunt-scorm-manifest
 *
 * Copyright (c) 2013 Ray Gesualdo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('scorm_manifest', 'Generate a valid SCORM IMS manifest file.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      version: '2004',
	  courseId: 'CourseID',
	  SCOtitle: 'SCO Title',
	  moduleTitle: 'Module',
	  launchPage: 'index.html',
	  path: './'
    });
	
	options.path = unixifyPath(options.path);

	var xml = { 
		firstLine: '<?xml version="1.0" encoding="UTF-8"?>\r\n',
		header: '',
		metadata: '',
		organization: '',
		resource: '',
		resourceList: '<resources>\r\n'
	};
	
	switch(options.version.toLowerCase()) {
		case "1.2":
			xml.header = '<manifest identifier="' + options.courseId + '" version="1" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">\r\n';
			xml.metadata = '<metadata>\r\n<schema>ADL SCORM</schema>\r\n<schemaversion>1.2</schemaversion>\r\n</metadata>\r\n';
			xml.resource += '<resource identifier="resource_1" type="webcontent" adlcp:scormtype="sco" href="' + options.launchPage + '">\r\n';
			break;
		case "2004v2":
			xml.header = '';
			break;
		case "2004": //fallthrough
		case "2004v3":
			xml.header = '<manifest identifier="' + options.courseId + '" version="1" xmlns="http://www.imsglobal.org/xsd/imscp_v1p1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3" xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3" xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3" xmlns:imsss="http://www.imsglobal.org/xsd/imsss" xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">\r\n';
			xml.metadata = '<metadata>\r\n<schema>ADL SCORM</schema>\r\n<schemaversion>2004 3rd Edition</schemaversion>\r\n</metadata>\r\n';
			xml.resource += '<resource identifier="resource_1" type="webcontent" adlcp:scormType="sco" href="' + options.launchPage + '">\r\n';
			break;
	}
	
	xml.organization = '<organizations default="' + options.courseId + '-org">\r\n<organization identifier="' + options.courseId + '-org">\r\n<title>' + options.SCOtitle + '</title>\r\n<item identifier="item_1" identifierref="resource_1">\r\n<title>' + options.moduleTitle + '</title>\r\n</item>\r\n</organization>\r\n</organizations>\r\n';
	
	// Iterate over all specified file groups.
    this.files.forEach(function(f) {
      if (!f.orig.expand) {
	    grunt.log.warn('Multiple files not specified.');
		return false;
	  }
	  
	  if (f.src.indexOf('imsmanifest.xml') > -1) {
        return false;
	  }
	  
	  // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return filepath;
      }).join('\r\n');
	  
	  //grunt.log.write('Filepath: ' + src + '\n');

	  xml.resourceList += '<file href="' + src + '"/>\r\n';
    });
	
	xml.resourceList += '</resource>\r\n</resources>\r\n</manifest>';

      // Write the destination file.
      grunt.file.write(options.path + 'imsmanifest.xml', xml.firstLine + xml.header + xml.metadata + xml.organization + xml.resource + xml.resourceList);

      // Print a success message.
      grunt.log.writeln('File "' + options.path + 'imsmanifest.xml' + '" created.');
  });

  var unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };
};
