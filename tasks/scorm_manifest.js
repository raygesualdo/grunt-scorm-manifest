/*
 * grunt-scorm-manifest
 * https://github.com/raygesualdo/grunt-scorm-manifest
 *
 * Copyright (c) 2013 Ray Gesualdo
 * Licensed under the MIT license.
 */
 
'use strict';

module.exports = function(grunt) {

    grunt.registerMultiTask('scorm_manifest', 'Generate a valid SCORM IMS manifest file.', function() {
        
        //Default options
        var options = this.options({
            version: '2004',
            courseId: 'CourseID',
            SCOtitle: 'SCO Title',
            moduleTitle: 'Module',
            launchPage: 'index.html',
            path: './'
        });
        
        //Instantiate XML tokens
        var xmlTokens = {
            versionString: '2004 3rd Edition',
            scormType: 'adlcp:scormType',
            fileArr: [
                {'@identifier':  'resource_1'},
                {'@type': 'webcontent'},
                {'@href': options.launchPage}
            ]
        };
        
        //Check version and set appropriate tokens
        switch(options.version.toLowerCase()) {
          case "1.2":
            xmlTokens.versionString = '1.2';
            xmlTokens.scormType = 'adlcp:scormtype';
            break;
          case "2004": //fallthrough
          case "2004v3":
            xmlTokens.versionString = '2004 3rd Edition';
            xmlTokens.scormType = 'adlcp:scormType';
            break;
        }
        
        //Hack to handle dynamic attribute name using token
        (function(){
            var tObj = {};
            tObj['@' + xmlTokens.scormType] = 'sco';
            xmlTokens.fileArr.push(tObj);
        })();
        
        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            
            //Make sure multiple files have been specified in Gruntfile
            if (!f.orig.expand) {
                grunt.log.warn('Multiple files not specified.');
                return false;
            }
            
            //Ignore the imsmanifest
            if (f.src.indexOf('imsmanifest.xml') > -1) {
                return false;
            }
            
            f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    var tObj = {
                        file: {
                            '@href': filepath,
                        },
                    };
                    xmlTokens.fileArr.push(tObj);
                    return true;
                }
            });
        });
        
        //Declare XMl structure
        var xmlObj = {
          manifest: {
            '@identifier': options.courseId,
            '@version': '1',
            metadata: {
                schema: 'ADL SCORM',
                schemaversion: xmlTokens.versionString
            },
            organizations: {
                '@default': options.courseId + '-org',
                organization: {
                    '@identifier': options.courseId + '-org',
                    title: options.SCOtitle,
                    item: {
                      '@identifier': 'item_1',
                      '@identifierref': 'resource_1',
                      title: options.moduleTitle
                    }
              }
            },
            resources: {
                resource: xmlTokens.fileArr,
            }
          },
        };    
       
       //Instatiate xmlbuilder using xmlObj
        var xmlDoc = require('xmlbuilder').create(xmlObj, 
            {version: '1.0', encoding: 'UTF-8', standalone: true},
            {ext: null},
            {allowSurrogateChars: false, headless: false, stringify: {}});
        
        //Check version and set appropriate manifest attributes
        switch(options.version.toLowerCase()) {
          case "1.2":
            xmlDoc.att('xmlns', 'http://www.imsproject.org/xsd/imscp_rootv1p1p2')
                  .att('xmlns:adlcp', 'http://www.adlnet.org/xsd/adlcp_rootv1p2')
                  .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
                  .att('xsi:schemaLocation', 'http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd');
            break;
          case "2004": //fallthrough
          case "2004v3":
            xmlDoc.att('xmlns', 'http://www.imsglobal.org/xsd/imscp_v1p1')
                  .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
                  .att('xmlns:adlcp', 'http://www.adlnet.org/xsd/adlcp_v1p3')
                  .att('xmlns:adlseq', 'http://www.adlnet.org/xsd/adlseq_v1p3')
                  .att('xmlns:adlnav', 'http://www.adlnet.org/xsd/adlnav_v1p3')
                  .att('xmlns:imsss', 'http://www.imsglobal.org/xsd/imsss')
                  .att('xsi:schemaLocation', 'http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd');
            break;
        }
        
        //Make it pretty
        var prettyXmlDoc = xmlDoc.end({pretty: true});
        
        //Write file to safe path
        options.path = unixifyPath(options.path);
        grunt.file.write(options.path + 'imsmanifest.xml', prettyXmlDoc);
        
        //Leave a sucess message
        grunt.log.writeln('File "' + options.path + 'imsmanifest.xml' + '" created.');
        
    });
    
    //Helper function for Windows systems
    var unixifyPath = function(filepath) {
        if (process.platform === 'win32') {
            return filepath.replace(/\\/g, '/');
        } else {
            return filepath;
        }
    };
    
};