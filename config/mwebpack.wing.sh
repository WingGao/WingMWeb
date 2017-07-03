#!/usr/bin/env bash
export PROJ_PATH=`pwd`
export MOD_PATH=/Users/gaoyunyun/Projs/SuamoIris/sc-admin/WingMWeb
echo "MOD_PATH=$MOD_PATH"
export NODE_PATH=$MOD_PATH/node_modules
cd $MOD_PATH
CONFIG_FILE=$PROJ_PATH/gulp_config.wing.js
ADMIN_CONFIG_FILE=$PROJ_PATH/../Admin/View/gulp_config.wing.js
PROJ_NAME="mall"


task_serv(){
    NAME=$PROJ_NAME"_serv"
    node server-dev.js -c $CONFIG_FILE
}
task_gulp(){
    NAME=$PROJ_NAME"_serv"
    ./node_modules/.bin/gulp -c $CONFIG_FILE
}
task_webpack(){
    ./node_modules/.bin/webpack --config $CONFIG_FILE --watch
}


case $1 in
    s)
        task_serv
    ;;
    g)
        task_gulp
    ;;
    w)
        task_webpack
    ;;
    t)
        task_test
    ;;
    prod)
        task_prod
    ;;
    kill)
        task_kill
    ;;
    *)
        echo 'all'
        tmuxinator start $PROJ_NAME
    ;;
esac

#screen -ls
#=== nohpu method ===
#nohup node server-dev.js -c ../../gulp_config.LL.js > $PROJ_PATH/dist/_ser.log 2>&1&
#nohup ./node_modules/.bin/gulp -c ../../gulp_config.LL.js > $PROJ_PATH/dist/_gulp.log 2>&1&
#./node_modules/.bin/webpack --config $PROJ_PATH/gulp_config.LL.js --watch