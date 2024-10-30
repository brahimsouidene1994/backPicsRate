const Keycloak = require("keycloak-connect");
const {
  KEYCLOAK_REALM,
  KEYCLOAK_URL,
  KEYCLOAK_CLIENT,
  KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_REALM_PUBLIC_KEY
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
  "realmPublicKey":`${KEYCLOAK_REALM_PUBLIC_KEY}`
}

module.exports = new Keycloak({}, config);