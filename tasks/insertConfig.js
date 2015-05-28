/*
 * insertConfig
 * https://github.com/wenxiang.hu/insertConfig
 *
 * Copyright (c) 2015 wenxiang.hu
 * Licensed under the MIT license.
 */

var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {


    grunt.registerMultiTask('insertConfig', 'require config insert', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({});
        var done = this.async();
        // Iterate over all specified file groups.
        var totalCount = this.files.length;
        this.files.forEach(function(f) {
            // Concat specified files.
            var filepath = f.src[0];
            f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    fs.readFile(filepath,'utf-8',function(err,data){
                        if (err) throw err;
                        (function (){
                            var newString = '';
                            var require =  function(dependencies,callback){
                                newString += 'require(' + arrayToString(dependencies) + ',' + callback.toString() + ');';
                            };
                            require.config = function(config){
                                if(!config[f.insertNode] || Object.prototype.toString.call(config[f.insertNode]) != '[object Object]'){
                                    config[f.insertNode] = {};
                                }
                                if(Object.prototype.toString.call(f.insertModule) != '[object Object]'){
                                    grunt.log.warn('insertModule is not Object');
                                }
                                for(var item in f.insertModule){
                                    config[f.insertNode][item] = f.insertModule[item];
                                }
                                newString +='require.config(' + JSON.stringify(config) + ');\n';
                            };
                            var define = function(moduleName,dependencies,callback){
                                var nameString = moduleName + ',';
                                if(Object.prototype.toString.call(moduleName) == '[object Array]'){
                                    nameString = '';
                                    callback = dependencies;
                                    dependencies = moduleName;
                                }
                                newString += 'define(' + nameString + arrayToString(dependencies) + ',' + callback.toString() + ');';
                            };
                            eval(data);
                            grunt.file.write(f.dest,newString,{encoding:'utf-8'});
                            grunt.log.writeln('File "' + f.dest + '" created.');
                            totalCount --;
                            if(totalCount == 0){
                                done();
                            }
                        })();
                    });
                }
            });
        });
    });

    function objectToString(object){
        var result = '';
        result += '{';
        for(var i in object){
            switch (Object.prototype.toString.call(object[i])){
                case '[object Object]':
                    result += i + ': ' + arguments.callee.call(this,object[i]);
                    break;
                case '[object Array]':
                    result += arrayToString(object[i]);
                    break;
                case '[object String]':
                    result += i + ": '" + object[i] + "'";
                    break;
                default :
                    result += i + ': '+object[i];
            }
            result += ',';
        }
        result = result.slice(0, result.length -1);
        result += '}';
        return result;
    }

    function arrayToString(array){
        var result = '';
        result += '[';
        array.forEach(function(item){
            switch (Object.prototype.toString.call(item)){
                case '[object Array]':
                    result += arguments.callee.call(this,item);
                    break;
                case '[object Object]':
                    result += objectToString(item);
                    break;
                case '[object String]':
                    result += "'" + item + "'";
                    break;
                default :
                    result += item;
            }
            result += ',';
        });
        result = result.slice(0, result.length -1);
        result += ']';
        return result;
    }

};