# Flota GPS — Panel de Viajes y Paradas

Panel estático (HTML + JS, sin backend) para analizar los reportes de
Viajes y Paradas exportados del sistema GPS. Se sube tal cual a GitHub
Pages: no requiere build ni servidor.

## Estructura

```
index.html               → el panel completo (todo en un solo archivo)
manifest.webmanifest      → permite "instalar" el panel como app
sw.js                     → service worker (funcionamiento offline + instalación)
icons/                    → íconos del logo en los tamaños que pide cada plataforma
```

## Publicarlo en GitHub Pages

1. Creá un repositorio nuevo en GitHub (puede ser público o privado, según
   quién deba acceder).
2. Subí el contenido de esta carpeta a la raíz del repo (mismo nivel que
   este README).
3. Andá a **Settings → Pages**.
4. En "Build and deployment" elegí **Deploy from a branch**, rama `main`
   y carpeta `/ (root)`.
5. Guardá. GitHub te va a dar una URL del estilo:
   `https://tu-usuario.github.io/tu-repo/`
6. Ese es el link que compartís con las personas que van a usar el panel.

No hace falta ningún paso extra: GitHub Pages sirve `index.html`
automáticamente y ya incluye HTTPS (necesario para que funcione el
service worker / la instalación).

## Cómo lo "descargan" quienes reciben el link

Al ser una PWA (Progressive Web App), no se descarga un instalador
tradicional: el navegador ofrece agregarlo como si fuera una app.

**En el celular (Android, Chrome):**
Abren el link → el navegador muestra un aviso "Agregar a pantalla de
inicio" (o lo encuentran en el menú ⋮ → "Instalar app" / "Agregar a
pantalla de inicio"). Queda como un ícono más, con el logo, y abre en
pantalla completa sin la barra del navegador.

**En el iPhone (Safari):**
Abren el link → tocan el botón de compartir (el cuadradito con la
flecha) → "Agregar a pantalla de inicio". iOS no muestra el aviso
automático como Android, pero el resultado es el mismo ícono en la
pantalla de inicio.

**En la computadora (Chrome, Edge):**
Abren el link → en la barra de direcciones aparece un ícono de instalar
(un monitor con una flecha) → "Instalar". Queda como una app de
escritorio con su propio ícono, separada de las pestañas del navegador.

## Actualizaciones

Cada vez que se sube un cambio a `index.html` (por ejemplo, cuando se
adapte a Supabase), GitHub Pages lo publica solo, sin pasos manuales.
Quienes ya instalaron el panel reciben la versión nueva automáticamente
la próxima vez que lo abran con conexión a internet (el service worker
se encarga de eso).
