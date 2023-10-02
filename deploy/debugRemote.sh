APP_DIR=/home/ci/app/thinker-robot-pi
HOST=192.168.1.22
USER=ci

echo "Launching app at $HOST"
ssh -i ./.keys/user-key $USER@$HOST "cd $APP_DIR && node --inspect=0.0.0.0 ./src/main.js"