var config = {
    "copy":{
        "html":{
            "sourceDir": "src/demo",
            "sourceFiles": ["index"],
            "destinationDir":"build/demo"
        },
        "js":{
            "sourceDir": "demo",
            "sourceFiles": ["index"],
            "destinationDir":"build/demo"
        },
        "css":{
            "sourceDir":null,
            "sourceFiles": null,
            "destinationDir":null
        },
        "json":{
            "sourceDir":null,
            "sourceFiles": null,
            "destinationDir":null
        },
        "other":{
            "sourceDir":"manual",
            "destinationDir":"build/manual"
        }
    }
};

module.exports = config;
