FROM bitnami/keycloak:latest

# Add the listener-webhook JAR file
COPY keycloak-webhook-0.5.0-all.jar /opt/bitnami/keycloak/providers/

USER root
RUN chown -R 1001:root /opt/bitnami/keycloak/providers/
USER 1001