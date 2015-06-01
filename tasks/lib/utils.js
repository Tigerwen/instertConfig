/**
 * Created by wenxiang.hu on 2015/5/30.
 */
function objectType(o){
    return Object.prototype.toString.call(o);
}
function objectToString(object){
    var result = '';
    result += '{';
    for(var i in object){
        switch (objectType(object[i])){
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
        switch (objectType(item)){
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

function replaceConfigString(str,startKey,endKey,insertModules){
    var startIndex = str.indexOf(startKey),
        offsetCount = endKey.length,
        tmpIndex = startIndex,
        tmpStr = str.slice(tmpIndex),
        endIndex = tmpStr.indexOf(endKey) + tmpIndex+offsetCount,
        result = str.slice(startIndex,endIndex),
        goon = true;
    while(goon){
        try{
            (function(){
                var require = function(){};
                var newString = '';
                require.config = function(config){
                    goon = false;
                    for(var item in insertModules){
                        if(objectType(insertModules[item] == '[object Object]')){
                            if(config[item] && objectType(config[item]) == '[object Object]'){
                                for(var i in insertModules[item]){
                                    config[item][i] = insertModules[item][i];
                                }
                            }else{
                                config[item] = insertModules[item];
                            }
                        }else if(objectType(insertModules[item] == '[object String]')){
                            config[item] = insertModules[item];
                        }
                    }
                    newString = startKey  + JSON.stringify(config) + endKey;
                };
                eval(result);
                str = str.replace(result,newString);
            })();
        }catch(e){
            tmpIndex = endIndex;
            tmpStr = str.slice(tmpIndex);
            endIndex = tmpStr.indexOf(endKey) + tmpIndex+offsetCount;
            result = str.slice(startIndex, endIndex);
        }
    }
    return str;
}

function filterInsertModules(insertModules,filterReg,replaceReg){
    var result = {};
    String.prototype.replaceAll = function(rules,str){
        var resultStr = this;
        if(objectType(rules) == '[object Array]'){
            rules.forEach(function(item){
                resultStr = resultStr.replace(item,str);
            });
            return resultStr;
        }else if(typeof rules == 'undefined'){
            return resultStr;
        }else{
            return resultStr.replace(rules,str);
        }
    }
    for(var item in insertModules){
        if(filterReg.test(item)){
            result[item.replaceAll(replaceReg,'')] = insertModules[item].replaceAll(replaceReg,'');
        }
    }
    return result;
}
module.exports = {
    objectToString: objectToString,
    arrayToString: arrayToString,
    replaceConfigString: replaceConfigString,
    filterInsertModules: filterInsertModules
};