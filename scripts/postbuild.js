/* eslint no-var: 0 */
var command = require('./command');
var configJson = require('./buildConfig.json');
var utils = require('./utils');

function doWeHaveSourceFileOrFiles(files){
    if(files){
        if(Array.isArray(files)) {
            if(files.length > 0) {
                return true
            }

        } else if(typeof sourceFiles === 'string'){
            if(files.length > 0) {
                return true
            }
        }
        else{
            console.error("Source files has to be Array or String")
        }
    }
    return false
}

function isStandardFileType(type){
    if(type == 'html' || type == 'css' || type == 'json'){
        return true;
    }
    return false;
}

/*------ Copy ------*/



function copy(config,command){
    if(config['html']){
        copyType(config['html'],'html',command)
    }

    if(config['css']){
        copyType(config['css'],'css',command)
    }

    if(config['json']){
        copyType(config['json'],'json',command)
    }

    if(config['other']){
        copyType(config['other'],'other',command)
    }
}


function copyType(config,type,command){
    var obj = config[type];
    if(obj){
        const sourceDir = obj.sourceDir;
        const sourceFiles = obj.sourceFiles;
        const destinationDir = obj.destinationDir;

        var isFileTypeStd = isStandardFileType(type);
        var isFileOrFilesGiven = doWeHaveSourceFileOrFiles(sourceFiles);
        if(isFileOrFilesGiven){
            var sourceDirPath = "";
            if(sourceDir){
                sourceDirPath = sourceDir + "/";
            }

            if(Array.isArray(sourceFiles)){
                sourceFiles.map(function(filePath){
                    if(isFileTypeStd){
                        if(filePath.endsWith("." + type)){
                            command.copyFile(sourceDirPath + filePath, destinationDir);
                        }else{
                            command.copyFile(sourceDirPath + filePath + "." + type,destinationDir);
                        }
                    }else{
                        command.copyFile(sourceDirPath + filePath, destinationDir);
                    }
                })
            }else{
                if(isFileTypeStd){
                    if(filePath.endsWith("." + type)){
                        command.copyFile(sourceDirPath + filePath, destinationDir);
                    }else{
                        command.copyFile(sourceDirPath + filePath + "." + type,destinationDir);
                    }
                }else{
                    command.copyFile(sourceDirPath + filePath, destinationDir);
                }
            }

        }else{
            if(sourceDir){
                if(destinationDir){
                    command.copyDir(sourceDir,destinationDir);
                }else{
                    console.error('Destination Directory Missing')
                }
            }else{
               console.error('Source Directory Missing')
            }
        }
    }
}

copy(configJson.copy,command);




