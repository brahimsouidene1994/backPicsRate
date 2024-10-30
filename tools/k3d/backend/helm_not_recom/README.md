## deploy backend to k3d

> helm upgrade --install -f ./tools/k3d/helm/values.yml backend-server ./tools/k3d/helm/helm --namespace studio-dev