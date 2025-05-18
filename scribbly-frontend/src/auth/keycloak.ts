// keycloak.ts
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',
  realm: 'whiteboard',
  clientId: 'whiteboard-app',
});

export default keycloak;
