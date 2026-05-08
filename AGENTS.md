# Instrucciones para Copilot / Coding Agent

> **IMPORTANTE:** Este archivo lo lee automáticamente Copilot Coding Agent al iniciar cualquier sesión en este repositorio. Las reglas de aquí son **vinculantes**.

---

## 1. Catálogo de skills

Este sitio se construye siguiendo las skills publicadas en el repo **[`retr0zer07/Skills`](https://github.com/retr0zer07/Skills)**.

**Antes de escribir cualquier código, lee íntegramente y aplica:**

| Skill | Cuándo aplica | Archivo fuente |
|---|---|---|
| `elite-marketing-web` | **SIEMPRE** — patrón de implementación base | [`skills/elite-marketing-web.md`](https://github.com/retr0zer07/Skills/blob/main/skills/elite-marketing-web.md) |
| `brand-visual-director` | Para definir tipografía, color, motion, atmósfera | [`skills/brand-visual-director.md`](https://github.com/retr0zer07/Skills/blob/main/skills/brand-visual-director.md) |
| `conversion-copywriter` | Para todo el copy (headlines, CTAs, FAQs, pricing) | [`skills/conversion-copywriter.md`](https://github.com/retr0zer07/Skills/blob/main/skills/conversion-copywriter.md) |
| `seo-technical` | Para `<head>`, Open Graph, JSON-LD, sitemap, robots.txt | [`skills/seo-technical.md`](https://github.com/retr0zer07/Skills/blob/main/skills/seo-technical.md) |
| `web-perf-auditor` | Para presupuesto de performance y Core Web Vitals | [`skills/web-perf-auditor.md`](https://github.com/retr0zer07/Skills/blob/main/skills/web-perf-auditor.md) |

El entregable debe respetar el **Output Contract** definido en `elite-marketing-web` (BRIEF → ASSUMPTIONS → SITEMAP → COPY DECK → DESIGN TOKENS → CODE → ANALYTICS → SEO → PERFORMANCE → A/B → NEXT STEPS).

---

## 2. Reglas duras (NO NEGOCIABLES)

Estas reglas existen porque **ya rompieron un sitio en producción**. No las saltes.

### 2.1 Visibilidad y progressive enhancement
- ❌ **PROHIBIDO** aplicar `opacity: 0` o `visibility: hidden` por defecto a contenido que dependa de JS para mostrarse.
- ✅ **OBLIGATORIO** gatear toda ocultación inicial con la clase `.js`:
  ```css
  .js .reveal { opacity: 0; transform: translateY(10px); transition: opacity .6s ease, transform .6s ease; }
  .js .reveal.visible { opacity: 1; transform: none; }
  ```
- ✅ **OBLIGATORIO** añadir como **primera línea** del `<head>`, antes de cualquier CSS:
  ```html
  <script>document.documentElement.classList.add('js');</script>
  ```
- ✅ **OBLIGATORIO** incluir fallback `<noscript>`:
  ```html
  <noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>
  ```
- ✅ **OBLIGATORIO** respetar reduced motion:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .reveal, .reveal.visible { opacity: 1 !important; transform: none !important; transition: none !important; }
  }
  ```

### 2.2 Compatibilidad con `file://`
- ❌ **PROHIBIDO** usar `<script type="module">` sin un fallback no-module o sin que la ocultación inicial esté gateada por `.js`.
- Razón: los módulos ES no se ejecutan bajo el protocolo `file://` (CORS), y el cliente puede abrir el sitio con doble clic.
- Test mental obligatorio: *"Si JS falla, no carga o se bloquea, ¿el contenido sigue siendo legible?"* → debe ser **SÍ** siempre.

### 2.3 Dark mode: todo o nada
- ❌ **PROHIBIDO** usar `@media (prefers-color-scheme: dark)` cambiando solo `--bg` o `background-color`. Eso produce "agujeros negros" con texto invisible.
- ✅ Si soportas dark mode, redefine **TODAS** las variables semánticas: `--bg`, `--surface`, `--text`, `--text-muted`, `--accent`, `--accent-contrast`, `--border`, `--input-bg`, `--input-text`, `--shadow`.
- ✅ Si no hay dark mode completo, **omite** el bloque `@media (prefers-color-scheme: dark)` y fuerza en `:root`:
  ```css
  :root { color-scheme: light; }
  ```

### 2.4 Mobile-first y sin overflow
- Probar en viewport ≤375px sin scroll horizontal.
- Imágenes con `max-width: 100%; height: auto;`.
- Nada de unidades fijas para anchos de contenedor.

---

## 3. Checklist de QA visual (antes de marcar el PR como listo)

El agente debe ejecutar mentalmente y declarar el resultado en la descripción del PR:

- [ ] Abrir `index.html` con doble clic (protocolo `file://`) → **todo el contenido es visible**.
- [ ] Deshabilitar JavaScript en el navegador → todo el contenido sigue visible y los CTAs primarios siguen siendo enlaces (`<a href>`), no botones JS-only.
- [ ] Activar `prefers-reduced-motion` → no hay animaciones que oculten contenido.
- [ ] Cambiar el SO a dark mode → la paleta se mantiene coherente.
- [ ] Probar en móvil (≤375px) → no hay overflow horizontal ni texto cortado.
- [ ] Lighthouse mobile: Performance ≥85, Accessibility ≥95, Best Practices ≥95, SEO 100.
- [ ] El formulario de contacto / cotización tiene `name`, `label`, `autocomplete`, validación HTML5 y mensaje de éxito accesible.

---

## 4. Datos del cliente

<!-- Reemplaza este bloque con los datos del intake. Mantén los campos vacíos como "N/A" para que el agente no improvise. -->

```yaml
empresa:
  nombre: ""
  direccion: ""
  registro_url: ""
  ano_inicio: ""

contacto:
  telefono: ""
  email: ""
  canales_preferidos: []   # ej: [whatsapp, email]

operacion:
  dias: ""                  # ej: "Lunes a Sábado"
  horario: ""               # ej: "9am - 6pm"
  dias_especiales: ""
  metodos_pago: []          # ej: [tarjetas, zelle, efectivo]
  ofrece_descuentos: false
  tiene_sucursales: false

negocio:
  servicios: []             # ej: ["Servicio de limpieza residencial"]
  publico_objetivo: ""      # ej: "Hidalgo County, Texas"

marketing:
  canales_principales: []   # ej: [facebook, instagram]
  campanas_pagas: false
  resenas_google: false
  responde_resenas: false

web:
  reservas_online: false
  gestion_reservas: ""      # plataforma o método
  tipo_agenda: ""
  experiencia_deseada: ""   # ej: "cotizar y agendar"
  comentarios: ""
  consentimiento_sms: false
```

---

## 5. Stack y convenciones del repo

- HTML semántico + CSS modular en `styles/` + JS vanilla en `scripts/` (sin frameworks salvo que el brief lo exija).
- Una rama por feature: `feat/...`, `fix/...`, `chore/...`.
- Commits convencionales: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`.
- Nada de dependencias npm pesadas si no aportan al usuario final.
- Imágenes en `assets/` optimizadas (WebP/AVIF + `<picture>` cuando aplique).

---

## 6. Cómo pedir trabajo al agente

Ejemplos de buenos prompts en este repo:

- *"Construye el sitio completo según AGENTS.md y los datos del cliente de la sección 4. Entrega siguiendo el Output Contract de la skill `elite-marketing-web`."*
- *"Audita performance del sitio actual aplicando `web-perf-auditor` y abre un PR con los fixes."*
- *"Reescribe el copy de la sección Hero aplicando `conversion-copywriter`. Mantén el resto intacto."*

---

_Última revisión de las reglas duras: ver historial de commits de [`retr0zer07/Skills`](https://github.com/retr0zer07/Skills/commits/main/skills/elite-marketing-web.md)._
