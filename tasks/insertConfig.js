/*
 * insertConfig
 * https://github.com/wenxiang.hu/insertConfig
 *
 * Copyright (c) 2015 wenxiang.hu
 * Licensed under the MIT license.
 */

var fs = require('fs');
var path = require('path');
var utils = require('./lib/utils.js');

module.exports = function(grunt) {

    function objectType(o){
        return Object.prototype.toString.call(o);
    }
    grunt.registerMultiTask('insertConfig', 'require config insert', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            startKey: 'require.config(',
            endKey: ')',
            insertModules: {
                'paths': {}
            }
        });
        var revMap = {};
        if(grunt.filerev && grunt.filerev.summary){
            for(var item in grunt.filerev.summary){
                revMap[item.replace(/\\/g,'/')] = grunt.filerev.summary[item].replace(/\\/g,'/');
            }
        }
        var done = this.async();
        // Iterate over all specified file groups.
        var totalCount = this.files.length;
        this.files.forEach(function(f) {
            // Concat specified files.
            for(var item in f.insertModules){
                if(objectType(f.insertModules[item]) == '[object Object]' && Object.keys(f.insertModules[item]).length == 0){
                    f.insertModules[item] = revMap;
                }
            }
            f.orig.src.forEach(function(filepath,index) {
                // Warn on and remove invalid source files (if nonull was set).
                var initExist = !grunt.file.exists(filepath);
                if (initExist &&!grunt.file.exists(revMap[filepath]) ) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    if(initExist){
                        filepath = revMap[filepath];
                    }
                    f.orig.src[index] = filepath;
                    fs.readFile(filepath,'utf-8',function(err,data){
                        if (err) throw err;
                        if(f.srcReg && f.srcReg[index]){
                            for(var item in f.insertModules){
                                if(objectType(f.insertModules[item]) == '[object Object]'){
                                    f.insertModules[item] = utils.filterInsertModules(f.insertModules[item], f.srcReg[index], f.replaceReg);
                                }
                            }
                        }
                        data = utils.replaceConfigString(data,options.startKey,options.endKey,f.insertModules)
                        if(!f.dest){
                            f.dest = f.orig.src;
                        }
                        grunt.file.write(f.dest[index],data);
                        grunt.log.writeln('File "' + f.dest[index] + '" created.');
                        totalCount --;
                        if(totalCount == 0){
                            done();
                        }
                    });
                }
            });
        });
    });

};