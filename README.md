# backPicsRate

## get into mongo container

> docker exec -it my-mongodb bash


## build backend image 

> docker build -t pics-rating-api:latest .


## start backenf image

> docker run -d -p 3000:3000 --name backend --network app-network -e DB_CONNECTION=mongodb://root:examplepassword@mongodb:27017/picsrate_db?authSource=admin -e PORT=3000 pics-rating-api:latest
