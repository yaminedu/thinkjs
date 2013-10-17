var Think = {
    start: function(){
        process.on('uncaughtException', function(err) {
          var log = 'Caught exception: ' + err;
          console.log(log);
          __response.end(log);
        });
        register_autoload(this.autoload);
        this.buildApp();
        think_require('App').run();
    },
    buildApp: function(){
        C(require(THINK_PATH + '/Conf/convention.js'));
        var file = CONF_PATH + '/config.js';
        if (is_file(file)) {
            C(require(file));
        };
        //自定义路由
        if (C('url_route_on')) {
            if (is_file(CONF_PATH + "/route.js")) {
                C("url_route_rules", require(CONF_PATH + "/route.js"));
            };
        };
        if (C('app_tags_on')) {
            C('sys_tags', require(THINK_PATH + "/Conf/tags.js"));
        };
        //common文件
        if (is_file(COMMON_PATH + "/common.js")) {
            require(COMMON_PATH + "/common.js");
        };
        //别名文件
        if (is_file(COMMON_PATH + "/alias.js")) {
            alias_import(require(COMMON_PATH + "/alias.js"));
        };
        if (APP_DEBUG) {
            C(require(THINK_PATH + "/Conf/debug.js"));
            var status = C('app_status');
            if (status && is_file(CONF_PATH + "/" + status + '.js')) {
                C(require(CONF_PATH + "/" + status + ".js"));
            };
        };
    },
    //模拟PHP的自动加载
    autoload: function(cls){
        var file = cls + ".class.js";
        var config = {
            Behavior: [
                THINK_LIB_PATH + "/Behavior/" + file,
                EXTEND_PATH + "/Behavior/" + file,
                LIB_PATH + "/Behavior/" + file
            ],
            Model: [
                LIB_PATH + "/Model/" + file,
                EXTEND_PATH + "/Model/" + file
            ],
            Action: [
                LIB_PATH + "/Action/" + file,
                EXTEND_PATH + "/Action/" + file
            ],
            Cache: [
                EXTEND_PATH + "/Driver/Cache/" + file,
                THINK_LIB_PATH + "/Driver/Cache/" + file
            ],
            Db: [
                EXTEND_PATH + "/Driver/Cache/" + file,
                THINK_LIB_PATH + "/Driver/Cache/" + file
            ],
        };
        for(var name in config){
            var length = name.length;
            if (cls.substr(0 - length) === name) {
                var list = config[name];
                var filepath = '';
                list.some(function(item){
                    if (is_file(item)) {
                        filepath = item;
                        return true;
                    };
                });
                if (filepath) {
                    return filepath;
                }; 
            };
        }
    }
}
module.exports = Think;