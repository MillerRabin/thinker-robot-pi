APP_DIR=/home/ci/app/thinker-robot-pi
HOST=192.168.1.22
USER=ci

echo "Cleaning up host dist folder"
rm -rf ./dist
echo "Creating deploy archive"
mkdir ./dist
tar -czvf ./dist/dist.tar.gz ./src package.json
echo "Cleaning up $HOST dist folder"
ssh -i ./.keys/user-key $USER@$HOST "rm -rf $APP_DIR/dist && mkdir -p $APP_DIR/dist"
echo "Uploading deploy archive to $HOST"
scp -pr -i ./.keys/user-key ./dist/dist.tar.gz ci@192.168.1.22:$APP_DIR/dist/
echo "Extracting archive at $HOST"
ssh -i ./.keys/user-key $USER@$HOST "cd $APP_DIR && tar -xzf ./dist/dist.tar.gz --directory $APP_DIR"
echo "Launching app at $HOST"
ssh -i ./.keys/user-key $USER@$HOST "cd $APP_DIR && node --inspect=0.0.0.0 ./src/main.js"
echo "Finished"