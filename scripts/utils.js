
function removePropertiesFromObj(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (keys.indexOf(i) >= 0) {
            continue;
        }
        if (!Object.prototype.hasOwnProperty.call(obj, i)){
            continue;
        }
        target[i] = obj[i];
    }
    return target;
}

function getPropertiesFromObj(obj, keys) {
    var target = {};
    for (var i in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, i)){
            continue;
        }

        if (keys.indexOf(i) >= 0) {
            target[i] = obj[i];
        }else{
            continue;
        }


    }
    return target;
}


module.exports = {
    removePropertiesFromObj,
    getPropertiesFromObj
};