## apply nginx controller for ingress

> docker tag backend-server:latest studio-registry:5050/picsrate-api:latest

> kubectl apply -f tools/k3d/backend/dep.yml 
> kubectl apply -f tools/k3d/backend/svc.yml 
> kubectl apply -f tools/k3d/backend/ingress.yml 