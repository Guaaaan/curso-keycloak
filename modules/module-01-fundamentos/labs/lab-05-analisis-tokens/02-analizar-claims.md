# Lab 05 — Análisis de Tokens

## Paso 02 — Analizar los Claims del Access Token

---

## 🎯 Objetivo

Comprender el significado de los principales claims incluidos en el `access_token`.

---

## 📋 Localizar el Payload

En la herramienta utilizada en el paso anterior (por ejemplo jwt.io), identifica la sección **Payload** del token.

---

## 🔎 Claims más importantes

---

### iss (Issuer)

Indica quién emitió el token.

Debe tener un valor similar a:

```
http://localhost:8080/realms/training
```

Esto confirma que el token fue emitido por el realm correcto.

---

### sub (Subject)

Identificador único del usuario autenticado dentro del realm.

Es un identificador interno (UUID), no necesariamente el username.

Este valor debe ser estable y único por usuario.

---

### azp (Authorized Party)

Indica qué cliente solicitó el token.

En este laboratorio debe mostrar:

```
spa-client
```

Este es el cliente que inició el flujo Authorization Code.

---

### aud (Audience)

Indica para qué recurso está destinado el token.

⚠️ En configuraciones por defecto de Keycloak, puede aparecer:

```
account
```

Esto es normal.

`aud` no siempre coincide con el cliente que solicitó el token.
El cliente que lo solicitó se identifica mediante el claim `azp`.

---

### exp (Expiration Time)

Marca el momento exacto en el que el token dejará de ser válido.

Está expresado en formato UNIX timestamp.

Permite verificar que el token no ha expirado.

---

### iat (Issued At)

Indica cuándo fue emitido el token.

También está expresado en formato UNIX timestamp.

---

### preferred_username

Nombre de usuario autenticado.

Debe mostrar:

```
user1
```

Este claim proviene de la información del usuario en el realm.

---

### realm_access

Incluye los roles asignados al usuario dentro del realm.

Ejemplo:

```
"realm_access": {
  "roles": ["offline_access", "uma_authorization"]
}
```

Estos roles pueden utilizarse posteriormente para decisiones de autorización en APIs.

---

## 🧠 Qué estamos validando

* El token pertenece al realm correcto (`iss`).
* El token fue solicitado por el cliente correcto (`azp`).
* El token está destinado a un recurso válido (`aud`).
* El usuario autenticado es el esperado (`preferred_username`, `sub`).
* El token tiene fecha de expiración (`exp`).
* Los roles están presentes en el payload (`realm_access`).

---

En el siguiente paso validaremos la firma del token utilizando el endpoint JWKS para comprobar que el token no ha sido modificado y fue realmente emitido por el realm.
