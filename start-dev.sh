sudo docker-compose -f ./docker-compose-dev.yml stop client

cd client/
npm run build
cd ../

sudo docker-compose -f ./docker-compose-dev.yml up --build --force-recreate client
