APP_DIR=/home/ci/app/thinker-robot-pi
HOST=192.168.1.22
USER=ci

echo "Cleaning up $HOST dist folder"
ssh -i ./.keys/user-key $USER@$HOST "rm -rf $APP_DIR/dist && mkdir -p $APP_DIR/dist"
echo "Clean finished"