# Flota GPS — Panel de Viajes y Paradas

Panel estático (HTML + JS) para analizar los reportes de Viajes y
Paradas exportados del sistema GPS. Los datos se guardan en Supabase,
así que cualquiera que reciba el link ve la misma información sin
depender de lo que haya subido cada uno por su cuenta. Está pensado
para vivir en GitHub y desplegarse en Vercel (o GitHub Pages): no
requiere build ni servidor propio.

## Estructura

```
index.html                → el panel completo (todo en un solo archivo)
manifest.webmanifest      → permite "instalar" el panel como app
sw.js                     → service worker (funcionamiento offline + instalación)
icons/                    → íconos del logo en los tamaños que pide cada plataforma
supabase_schema.sql       → tablas y permisos a crear en Supabase (una sola vez)
```

## Configurar Supabase (para que los datos queden guardados y se compartan)

1. Creá una cuenta / proyecto en [supabase.com](https://supabase.com) (el
   plan gratis alcanza de sobra para este panel).
2. Andá a **SQL Editor → New query**, pegá el contenido completo de
   `supabase_schema.sql` y ejecutalo. Esto crea las tablas `vehiculos`,
   `viajes` y `paradas`, con la restricción que evita duplicados y los
   permisos para que cualquiera con el link pueda leer y cargar datos.
3. Andá a **Project Settings → API** y copiá:
   - **Project URL**
   - **anon public** key
4. Abrí `index.html`, buscá estas dos líneas (cerca del principio del
   `<script>` principal) y reemplazá los valores:
   ```js
   const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';
   const SUPABASE_ANON_KEY = 'TU-ANON-KEY-PUBLICA';
   ```
5. Subí ese cambio al repo de GitHub (Vercel va a redeployar solo).

Mientras esas dos líneas digan `TU-PROYECTO` / `TU-ANON-KEY-PUBLICA`, el
panel lo va a avisar en la barra de carga y no va a poder guardar nada.

**Sobre la clave "anon public":** es normal que quede visible en el
código del lado del cliente — Supabase está pensado así. La protección
no es el secreto de esa clave, sino las políticas de RLS que ya vienen
en `supabase_schema.sql`: permiten leer y cargar, pero no borrar ni
editar lo que subió otra persona.

## Botón "Guardar vista (.html)"

Descarga una copia de este mismo panel con los datos y los filtros que
estén elegidos en ese momento ya fijos adentro del archivo. Sirve para
mandar por correo o archivar una foto exacta de lo que se estaba viendo
(por ejemplo, el cierre de un mes), sin que dependa de que los datos
sigan estando en Supabase ni de tener conexión a internet para abrirla.

Al abrir ese archivo descargado, el panel arranca directamente con esos
datos y esos filtros — no se conecta a Supabase. Si desde ahí se sube un
reporte nuevo, ese archivo vuelve a comportarse como el panel en vivo
(guarda en Supabase y trae los datos actualizados).

## Publicarlo (Vercel o GitHub Pages)

**Si ya tenés el repo conectado a Vercel** (como en este caso): no hay
nada más que hacer para publicar. Cada `git push` a la rama que Vercel
está siguiendo dispara un deploy automático — no hace falta build
command ni configuración especial, es HTML/CSS/JS servido tal cual.

**Si preferís GitHub Pages** en vez de (o además de) Vercel:
1. Andá a **Settings → Pages** del repositorio.
2. En "Build and deployment" elegí **Deploy from a branch**, rama `main`
   y carpeta `/ (root)`.
3. Guardá. GitHub te da una URL del estilo:
   `https://tu-usuario.github.io/tu-repo/`

Cualquiera de las dos opciones sirve `index.html` con HTTPS, que es lo
único que exige el service worker para funcionar.

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

Cada vez que se sube un cambio a `index.html` (por ejemplo, si más
adelante se agrega el módulo de Indicadores Mensuales), Vercel / GitHub
Pages lo publica solo, sin pasos manuales. Quienes ya instalaron el
panel reciben la versión nueva automáticamente la próxima vez que lo
abran con conexión a internet (el service worker se encarga de eso).
Los datos en sí no dependen del deploy: viven en Supabase, así que
sobreviven a cualquier actualización del código.

