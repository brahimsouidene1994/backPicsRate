FROM bitnami/keycloak:21.1.1-debian-11-r17

# Add the listener-webhook JAR file
COPY keycloak-webhook-0.5.0-all.jar /opt/bitnami/keycloak/providers/

USER root
RUN chown -R 1001:root /opt/bitnami/keycloak/providers/
USER 1001