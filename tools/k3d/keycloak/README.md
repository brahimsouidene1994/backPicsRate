## deploy k3d

### build keycloak image with webhook-http

> cd webhook-image
> docker build -t keycloak-webhook:latest .
> docker tag keycloak-webhook:latest studio-registry:5000/keycloak-webhook:latest
> docker push studio-registry:5000/keycloak-webhook:latest

### THEME

> kubectl apply -f keycloak/themes/themes-pvc.yaml -n studio-qa

> kubectl apply -f keycloak/themes/data-pod.yaml -n studio-qa

> kubectl cp keycloak/themes/keywind keycloak-utility:/keycloak/data/ -n studio-qa

> kubectl delete -f keycloak/themes/data-pod.yaml -n studio-qa

### PROVIDER

> kubectl apply -f keycloak/providers/provider-pvc.yaml -n studio-qa

> kubectl apply -f keycloak/providers/data-pod.yaml -n studio-qa

> kubectl cp keycloak/providers/keycloak-webhook-0.5.0-all.jar keycloak-utility:/keycloak/data/ -n studio-qa

> kubectl delete -f keycloak/providers/data-pod.yaml -n studio-qa

### keycloak

## add bitnami/keycloak to helm
    > helm repo add bitnami https://charts.bitnami.com/bitnami
    > helm repo update

> kubectl apply -f keycloak/postgresql/pvc.yaml -n studio-qa

> kubectl apply -f keycloak/config/realm.yaml -n studio-qa

> helm upgrade --install keycloak bitnami/keycloak -f keycloak/values.yaml -n studio-qa --version 21.0.1