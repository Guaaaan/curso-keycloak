# Configuración de clientes y capacidades en Keycloak

En Keycloak, cada **cliente (client)** representa una aplicación que se integrará con el servidor de identidad.

Durante su configuración se definen varias **capabilities**, que determinan:

```text
• qué flujos OAuth2 puede usar el cliente
• cómo se autentica el cliente
• cómo obtiene tokens
```

Estas opciones se configuran en:

```
Client → Settings → Capability config
```

La pantalla incluye varios switches que habilitan diferentes comportamientos.

---

# 1. Client Authentication

Esta opción define si el cliente debe **autenticarse ante Keycloak**.

```
Client authentication → ON
```

Significa que el cliente es un **Confidential Client**.

El cliente deberá enviar credenciales cuando solicite un token.

Ejemplo:

```
client_id
client_secret
```

Ejemplo de petición:

```bash
curl -X POST \
https://auth.example.com/realms/training/protocol/openid-connect/token \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant_type=client_credentials" \
-d "client_id=backend-service" \
-d "client_secret=SECRET"
```

### Métodos de autenticación disponibles

En la pestaña **Credentials** se pueden usar:

```
client_secret
client_secret_basic
client_secret_post
private_key_jwt
mutual TLS (mTLS)
```

### Cuándo activarlo

| Tipo aplicación       | Configuración |
| --------------------- | ------------- |
| Backend API           | ON            |
| Microservicios        | ON            |
| SPA (Angular / React) | OFF           |
| Mobile apps           | OFF           |

---

# 2. Authorization

Esta opción habilita el **Authorization Services de Keycloak**.

```
Authorization → ON
```

Esto permite que Keycloak gestione **políticas de autorización avanzadas**.

Por ejemplo:

```
resources
scopes
policies
permissions
```

El sistema se basa en el estándar:

```
UMA (User Managed Access)
```

Cuando está activado aparece una nueva pestaña:

```
Authorization
```

donde se pueden definir:

```
Resources
Scopes
Policies
Permissions
```

### Cuándo usarlo

Se utiliza cuando Keycloak debe actuar como **motor centralizado de autorización**.

En muchos sistemas simples se mantiene:

```
Authorization → OFF
```

y la autorización se gestiona dentro de las APIs.

---

# 3. Standard Flow

Esta opción habilita el flujo OAuth2 más común:

```
Authorization Code Flow
```

Es el flujo recomendado para aplicaciones web.

### Funcionamiento

```
Browser
   |
   | redirect login
   v
Keycloak
   |
   | authorization code
   v
application
   |
   | exchange code
   v
access_token
```

### Configuración típica para SPA

```
Client authentication → OFF
Standard flow → ON
PKCE → S256
```

### Configuración típica para aplicaciones web backend

```
Client authentication → ON
Standard flow → ON
```

---

# 4. Direct Access Grants

Esta opción habilita el flujo:

```
Resource Owner Password Credentials
```

Este flujo permite enviar directamente las credenciales del usuario al servidor de identidad.

Ejemplo:

```bash
curl -X POST \
https://auth.example.com/realms/training/protocol/openid-connect/token \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant_type=password" \
-d "username=user" \
-d "password=password" \
-d "client_id=my-client"
```

Flujo conceptual:

```
client
  |
  | username + password
  v
Keycloak
  |
  | access_token
```

### Consideraciones

Este flujo está considerado **legacy** en OAuth2.

Se desaconseja en nuevas arquitecturas porque:

```
la aplicación conoce la contraseña del usuario
```

Hoy en día se prefiere:

```
Authorization Code + PKCE
```

---

# 5. Service Account Roles

Esta opción habilita el uso de **Service Accounts**.

```
Service account roles → ON
```

Cuando se activa, el cliente puede usar el flujo:

```
Client Credentials Grant
```

Este flujo permite obtener tokens **sin intervención de usuario**.

Flujo conceptual:

```
service
   |
   | client_id + client_secret
   v
Keycloak
   |
   | access_token
   v
API
```

Ejemplo:

```bash
curl -X POST \
https://auth.example.com/realms/training/protocol/openid-connect/token \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant_type=client_credentials" \
-d "client_id=backend-service" \
-d "client_secret=SECRET"
```

Keycloak crea automáticamente un usuario técnico:

```
service-account-{client_id}
```

Ese usuario puede tener:

```
roles
permissions
scopes
```

---

# 6. Implicit Flow

Este flujo fue usado antiguamente por aplicaciones SPA.

Funcionaba devolviendo el token directamente en la URL.

```
Browser → Keycloak → access_token
```

Sin paso intermedio de código.

Hoy está considerado **obsoleto**.

Se recomienda utilizar:

```
Authorization Code + PKCE
```

Por este motivo normalmente se mantiene:

```
Implicit Flow → OFF
```

---

# 7. Standard Token Exchange

Permite intercambiar un token existente por otro token.

Ejemplo:

```
token A → token B
```

Casos de uso:

```
delegación entre servicios
microservicios
impersonation
```

Ejemplo conceptual:

```
Service A token
      |
      v
Keycloak token exchange
      |
      v
Service B token
```

---

# 8. OAuth 2.0 Device Authorization Grant

Este flujo está pensado para dispositivos sin navegador.

Ejemplos:

```
Smart TVs
IoT devices
CLI tools
```

Flujo conceptual:

```
Device → obtiene device_code
User → introduce código en navegador
Keycloak → autoriza dispositivo
Device → obtiene token
```

---

# 9. OIDC CIBA Grant

CIBA significa:

```
Client Initiated Backchannel Authentication
```

Permite autenticación **sin redirección del navegador**.

El flujo ocurre en segundo plano.

Ejemplo:

```
app solicita autenticación
usuario recibe notificación en móvil
usuario aprueba
app obtiene token
```

Se usa principalmente en:

```
banca
identidad digital
sistemas regulados
```

---

# 10. PKCE Method

PKCE añade una capa de seguridad al flujo Authorization Code.

Protege contra:

```
authorization code interception
```

El cliente genera:

```
code_verifier
code_challenge
```

Flujo:

```
client → code_challenge
Keycloak → authorization_code
client → code_verifier
Keycloak → valida challenge
```

Configuración recomendada:

```
PKCE → S256
```

Especialmente para:

```
SPA
mobile apps
```

---

# 11. Require DPoP Bound Tokens

DPoP significa:

```
Demonstration of Proof of Possession
```

Es una técnica para evitar que un token robado pueda reutilizarse.

Cada petición incluye una prueba criptográfica firmada.

Flujo conceptual:

```
client
   |
   | request + signed proof
   v
API
```

El token queda ligado a la clave del cliente.

---

# Resumen de configuraciones típicas

### SPA (Angular / React)

```
Client authentication → OFF
Standard flow → ON
PKCE → S256
Implicit flow → OFF
```

---

### Backend Web

```
Client authentication → ON
Standard flow → ON
```

---

### Microservicio

```
Client authentication → ON
Service account roles → ON
```

---

### CLI / IoT

```
Device Authorization Grant → ON
```