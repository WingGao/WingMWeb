#!/usr/bin/env bash
export PROJ_PATH=`pwd`
export MOD_PATH=/Users/gaoyunyun/Projs/SuamoIris/sc-admin/WingMWeb
echo "MOD_PATH=$MOD_PATH"
export NODE_PATH=$MOD_PATH/node_modules
cd $MOD_PATH

CONFIG_FILE=$PROJ_PATH/gulp_config.wing.js
#ADMIN_CONFIG_FILE=$PROJ_PATH/../Admin/View/gulp_config.wing.js
PROJ_NAME="haokai"

task_test() {
    # screen -dmS $PROJ_NAME"_serv" ping baidu.com
    if [ "$1" -eq 0 ]; then
        echo "eq 0"
    fi
    echo "test"
}

# $1 运行类型 0=正常 1=只运行kill
task_serv(){
    NAME=$PROJ_NAME"_serv"

    #screen -ls | grep -o "[0-9]*."$PROJ_NAME"_serv" | awk -F '.' '{ print $1 }' | xargs kill
    screen -X -S $NAME quit
    sleep 2
    screen -wipe
    if [ "$1" -eq 0 ] ; then
        echo "screen -dmS $NAME node server-dev.js -c $CONFIG_FILE"
        screen -dmS $NAME node server-dev.js -c $CONFIG_FILE
    fi
}

task_gulp(){
    NAME=$PROJ_NAME"_gulp"

    #screen -ls | grep -o "[0-9]*."$PROJ_NAME"_gulp" | awk -F '.' '{ print $1 }' | xargs kill
    screen -X -S $NAME quit
    sleep 2
    screen -wipe
    if [ "$1" -eq 0 ] ; then
        echo "screen -dmS $NAME ./node_modules/.bin/gulp -c $CONFIG_FILE"
        screen -dmS $PROJ_NAME"_gulp" ./node_modules/.bin/gulp -c $CONFIG_FILE
    fi
}

task_webpack(){
    NAME=$PROJ_NAME"_webpack"

    #screen -ls | grep -o "[0-9]*."$PROJ_NAME"_webpack" | awk -F '.' '{ print $1 }' | xargs kill
    screen -X -S $NAME quit
    sleep 2
    screen -wipe
    echo "./node_modules/.bin/webpack --config $CONFIG_FILE --watch"
#    screen -dmS $PROJ_NAME"_webpack" ./node_modules/.bin/webpack --config $CONFIG_FILE --watch
    ./node_modules/.bin/webpack --config $CONFIG_FILE --watch
}
task_prod(){
    export WING_M_WEB=prod
    #gulp
    ./node_modules/.bin/gulp prod -c $CONFIG_FILE
    #webpack 
    ./node_modules/.bin/webpack --config $CONFIG_FILE
}
task_kill(){
    task_serv 1
    task_gulp 1
}
case $1 in
    s)
        task_serv 0
    ;;
    g)
        task_gulp 0
    ;;
    w)
        task_webpack
    ;;
    t)
        task_test 1
    ;;
    prod)
        task_prod
    ;;
    kill)
        task_kill
    ;;
    *)
        echo 'all'
        task_serv 0
        task_gulp 0
        task_webpack
    ;;
esac

#./node_modules/.bin/webpack --config $CONFIG_FILE --watch

#screen -ls
#=== nohpu method ===
#nohup node server-dev.js -c ../../gulp_config.LL.js > $PROJ_PATH/dist/_ser.log 2>&1&
#nohup ./node_modules/.bin/gulp -c ../../gulp_config.LL.js > $PROJ_PATH/dist/_gulp.log 2>&1&
#./node_modules/.bin/webpack --config $PROJ_PATH/gulp_config.LL.js --watch