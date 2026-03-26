# 🌙 Cumple Vampi — Guía de Personalización

Una noche mágica, íntima, gótica, tierna y hecha completamente para ella.

---

## 📁 Archivos del proyecto

```
CumpleVampi/
├── index.html          ← Estructura completa
├── style.css           ← Todo el diseño visual
├── app.js              ← Animaciones e interacciones
├── nuestra-cancion.mp3 ← 🎵 Agrega tu archivo aquí
└── README.md           ← Esta guía
```

---

## 🎵 Cómo agregar la música

1. Descarga "Mesa y Cama" de Roberto Carlos en formato MP3
2. Cópiala a esta carpeta con el nombre `nuestra-cancion.mp3`
3. ¡Listo! La música comenzará al presionar el botón de entrada

> Si el archivo tiene otro nombre, edita esta línea en `index.html`:
> ```html
> <source src="nuestra-cancion.mp3" type="audio/mpeg" />
> ```

---

## ✏️ Cómo personalizar los textos

### Título principal (Hero)
En `index.html`, busca:
```html
<h1 class="hero-title">
  Feliz cumpleaños,<br />
  <em>mi hermosa criatura<br />de la noche</em>
</h1>
```

### Carta romántica (Sección 2)
Busca el bloque con `<!-- ✏️ EDITABLE: Reemplaza este texto -->` y cambia el contenido dentro de `.letter-body`. Puedes poner tu mensaje real ahí.

### Mensaje de la sorpresa final (Modal)
Busca `<!-- ✏️ EDITABLE: Mensaje de la sorpresa final -->` en el modal y cambia el texto.

### Mensajes de las estrellas interactivas
En `app.js`, busca:
```js
// ✏️ EDITABLE: Cambia estos mensajes por lo que más la describa
const messages = [
  { text: '✨ Tu risa', emoji: '😄' },
  ...
```
Cambia los textos por cosas reales de ella.

---

## 📷 Cómo agregar fotos (Sección de Recuerdos)

Reemplaza cada bloque de placeholder por:
```html
<div class="polaroid" data-reveal-stagger>
  <div class="polaroid-img">
    <img src="foto1.jpg" alt="Descripción del recuerdo" />
  </div>
  <p class="photo-caption">El día que fuimos a...</p>
</div>
```

Puedes agregar o quitar polaroids según cuántas fotos tengas.

---

## 🌐 Cómo abrir la página

### Opción 1 — Abrir directamente
Haz doble clic en `index.html`. Funcionará en la mayoría de navegadores modernos (Chrome, Edge, Firefox).

> ⚠️ El audio puede no funcionar al abrir como archivo local. Para solucionar eso:

### Opción 2 — Servidor local (recomendado para audio)
Si tienes Node.js instalado:
```bash
npx serve .
```
Luego abre `http://localhost:3000`

O con Python:
```bash
python -m http.server 8080
```
Luego abre `http://localhost:8080`

---

## 💌 Secciones de la página

| # | Sección | Contenido |
|---|---------|-----------|
| 1 | Hero / Entrada | Cielo nocturno + botón de entrada + música |
| 2 | Carta | Tu mensaje personal romántico |
| 3 | Tu Universo | 5 tarjetas: Vampiros, Vegana, Badtz-Maru, Jerbos, El Principito |
| 4 | Recuerdos | Galería de fotos tipo polaroid |
| 5 | Estrellas | Campo interactivo con mensajes al hacer clic |
| 6 | Jerbos | 4 guardianes adorables con nombres propios |
| 7 | Jardín Vegano | Elementos de su esencia vegana |
| 8 | Cierre | Mensaje final + botón sorpresa + modal |

---

## 🥚 Easter Eggs escondidos

- 🦇 **Murciélago** — En la esquina inferior izquierda del hero
- 🌹 **Rosa** — En la esquina inferior derecha de la sección final
- 🐧 **Badtz-Maru** — Hover sobre su tarjeta
- ⭐ **Estrella especial** — La primera estrella del campo tiene una marca dorada
- 💕 **Consola del navegador** — Ábrela y habrá un mensaje especial

---

## 🎨 Paleta de colores

| Variable | Color | Uso |
|----------|-------|-----|
| `--night` | `#0B0B0F` | Fondo principal |
| `--wine` | `#2A0E18` | Fondos secundarios |
| `--burgundy` | `#5A1022` | Acentos oscuros |
| `--rose-dark` | `#8B1E3F` | Acentos principales |
| `--lilac` | `#7B5C8E` | Detalles suaves |
| `--old-rose` | `#C08AA3` | Textos secundarios |
| `--cream` | `#F2E9E4` | Textos principales |
| `--gold` | `#C8A96B` | Detalles dorados |

---

_Hecho con amor 🥀_
