# backPicsRate

## get into mongo container

> docker exec -it my-mongodb bash


## build backend image 

> docker build -t picsrate-api:latest .

> docker build -t picsrate-api:v0.1 .
## start backenf image

> docker run -d -p 3000:3000 --name backend --network app-network -e DB_CONNECTION=mongodb://root:examplepassword@mongodb:27017/picsrate_db?authSource=admin -e PORT=3000 pics-rating-api:latest

## push to registry

> docker tag picsrate-api:latest studio-registry:5000/picsrate-api:latest

> docker push studio-registry:5000/picsrate-api:latest