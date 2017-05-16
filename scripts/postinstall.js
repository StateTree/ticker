/* eslint no-var: 0 */
var command = require('./command');
var packageJson = require('./../package.json');
var utils = require('./utils');



/*------ Update package.json ------*/


var json = utils.getPropertiesFromObj(packageJson,[
    'dependencies'
]);

var newJson = {
    'devDependencies': json.dependencies,
    'scripts':{
        "prebuild": "node scripts/prebuild.js",
        "build": "node scripts/build.js production",
        "postbuild": "node scripts/postbuild.js"
    }
};

/*command.remove('../../scripts/postinstall.js',function(){
	command.remove('../../node_modules/library-boilerplate')
})*/

command.createDir( '../../src',function(){
    command.createDir( '../../test',function(){
        command.createDir( '../../lib',function(){
            command.copyDir( './scripts', '../../scripts',function(){
                command.copyFile( './webpack.config.js', '../../webpack.config.js',function(){
                    command.copyFile( './.babelrc', '../../.babelrc',function(){
                        command.updateJson( '../../package.json', newJson,function(){
                            command.execute('../../node_modules/.bin/eslint --init')
                        });
                    });
                });
            });
        });
    });
});











