const Keycloak = require("keycloak-connect");
const {
  KEYCLOAK_REALM,
  KEYCLOAK_URL,
  KEYCLOAK_CLIENT,
  KEYCLOAK_CLIENT_SECRET,
} = process.env;

const config = {
  "realm": `${KEYCLOAK_REALM}`,
  "auth-server-url": `${KEYCLOAK_URL}`,
  "ssl-required": "external",
  "resource": `${KEYCLOAK_CLIENT}`,
  "bearerOnly": true,
  "credentials": {
    "secret": `${KEYCLOAK_CLIENT_SECRET}`
  },
  "confidential-port": 0
}

module.exports = new Keycloak({},config);