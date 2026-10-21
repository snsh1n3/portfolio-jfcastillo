# Guía de despliegue (PowerShell)

Sitio estático servido por un Worker de Cloudflare con Static Assets en `jfcastillo.chusquisimas.com`.
Esta guía la ejecuta el propietario desde su equipo. Tiempo estimado: 20–30 minutos.

Convenciones: `PS>` es PowerShell. Usa `curl.exe` (no `curl`, que en PowerShell es un alias de otro comando).

## 0. Requisitos

```powershell
PS> node -v     # debe ser v22.12 o superior
PS> git --version
```

## 1. Obtener el código

```powershell
PS> git clone https://github.com/snsh1n3/portfolio-jfcastillo.git
PS> cd portfolio-jfcastillo
PS> npm ci
```

Si ya lo tienes clonado: `git pull` y `npm ci`.

## 2. Compilar y verificar

```powershell
PS> npm run build
```

Debe terminar con `0 errors` y la línea `verify-dist OK`. Si falla, no sigas: el mensaje dice qué falta
(traducción, PDF del CV, imagen Open Graph, etc.).

## 3. Probar localmente (con las cabeceras reales)

```powershell
PS> npm run preview
```

Abre `http://localhost:8787`. Comprueba:

- `/` en inglés y `/es/` en español; el botón EN / ES cambia de idioma.
- `/cv/juan-castillo-cv.pdf` descarga el CV.
- `/ruta-que-no-existe/` muestra la página 404.
- El correo se muestra completo al cargar (se arma con JavaScript).
- En otra terminal: `curl.exe -I http://localhost:8787/` debe mostrar `content-security-policy`,
  `strict-transport-security`, `x-content-type-options` y `referrer-policy`.

Detén el servidor con `Ctrl + C`.

## 4. Revisión previa de la zona (solo lectura, Cloudflare)

Ya revisado: rutas de `chusquisimas-v2`, registros DNS y aplicaciones de Access (sin comodines).
Falta, en el panel de la zona `chusquisimas.com`:

1. Security → WAF → Custom rules: ninguna regla debe afectar a `jfcastillo.chusquisimas.com`.
2. Rules → Redirect Rules, Cache Rules y Transform Rules: ninguna debe coincidir con ese nombre
   (cuidado con reglas que usen `*.chusquisimas.com` o `contains "chusquisimas.com"`).

## 5. Fecha de compatibilidad

En `wrangler.jsonc`, `compatibility_date` debe ser el día del primer despliegue (formato `YYYY-MM-DD`).
Si hoy no es 2026-10-20, cámbiala y confirma:

```powershell
PS> git add wrangler.jsonc
PS> git commit -m "Set compatibility date for first deploy"
PS> git push
```

## 6. Iniciar sesión en Cloudflare

```powershell
PS> npx wrangler login
PS> npx wrangler whoami
```

`whoami` debe mostrar la cuenta donde vive `chusquisimas-v2`. Si aparece otra, no continúes.

## 7. Simulacro

```powershell
PS> npx wrangler deploy --dry-run
```

Debe leer 24 archivos de `dist` sin errores y terminar con `--dry-run: exiting now.`

## 8. Desplegar

```powershell
PS> npm run deploy
```

Compila, verifica y publica. Al final debe aparecer `jfcastillo.chusquisimas.com (custom domain)`.
Cloudflare crea solo el registro DNS y el certificado; el certificado puede tardar unos minutos.
Si el navegador muestra un error de certificado, espera 5 minutos y reintenta.

## 9. Verificación posterior

```powershell
PS> curl.exe -I https://jfcastillo.chusquisimas.com/
PS> curl.exe -I https://jfcastillo.chusquisimas.com/es/
PS> curl.exe -I https://jfcastillo.chusquisimas.com/cv/juan-castillo-cv.pdf
PS> curl.exe -I https://jfcastillo.chusquisimas.com/no-existe/
```

Esperado: `200`, `200`, `200` (`application/pdf`) y `404`; las tres primeras con
`content-security-policy` y `strict-transport-security`.

Y en el navegador:

- Ambos idiomas, en escritorio y en el móvil.
- Que `chusquisimas.com` y `admin.chusquisimas.com` sigan funcionando igual (el login de Access incluido).
- `https://jfcastillo.chusquisimas.com/robots.txt` y `/sitemap-index.xml`.
- Vista previa al compartir: pega la URL en un mensaje de LinkedIn o usa un validador de Open Graph.
- Opcional: Lighthouse en Chrome DevTools (Rendimiento, Accesibilidad, Prácticas recomendadas, SEO).
- Opcional: Google Search Console → añadir `https://jfcastillo.chusquisimas.com/` y enviar `sitemap-index.xml`.

## 10. Actualizar contenido más adelante

Los textos están en `src/content/` (cada cadena en inglés y español). Edita, y luego:

```powershell
PS> npm run deploy
PS> git add -A; git commit -m "Update content"; git push
```

## 11. Marcha atrás

- Volver a la versión anterior del Worker: `npx wrangler rollback`.
- Retirar el sitio sin tocar nada más: panel Workers & Pages → `jfcastillo-portfolio` → Settings →
  Domains & Routes → quitar `jfcastillo.chusquisimas.com`. No afecta a `chusquisimas-v2`.

## Si algo falla

| Síntoma | Causa probable | Qué hacer |
| --- | --- | --- |
| `Node.js ... not supported` | Node anterior a 22.12 | Instalar Node 22 LTS |
| `A DNS record already exists` | Ya hay un registro para `jfcastillo` | Revisar DNS y quitarlo, o avisar |
| Error de autenticación | Sesión caducada | `npx wrangler login` otra vez |
| Página en blanco sin CSS | Caché o `dist` incompleto | `npm run build` otra vez y redesplegar |
| El correo no aparece | JavaScript bloqueado | Normal: se ve como `usuario [arroba] gmail [punto] com` |
