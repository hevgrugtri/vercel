# PRD: Tienda en Línea de Productos Artesanales

## Documento de Producto Requerido
**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Plataforma:** Next.js

---

## 1. Resumen Ejecutivo

### 1.1 Visión del Producto
Crear una plataforma web moderna y atractiva que conecte a artesanos locales con compradores que valoran productos únicos y hechos a mano. La tienda debe transmitir autenticidad, calidez y la historia detrás de cada pieza artesanal.

### 1.2 Objetivo Principal
Desarrollar una tienda en línea completa que permita a los usuarios:
- Explorar y descubrir productos artesanales de manera intuitiva
- Realizar compras de forma segura y sencilla
- Conocer la historia de los artesanos y sus creaciones

### 1.3 Público Objetivo
- **Primario:** Personas entre 25-55 años que valoran productos únicos y sostenibles
- **Secundario:** Compradores de regalos especiales y coleccionistas de artesanías
- **Terciario:** Empresas que buscan regalos corporativos con significado

---

## 2. Funcionalidades Esenciales

### 2.1 Catálogo de Productos

| Funcionalidad | Descripción | Prioridad |
|---------------|-------------|-----------|
| Listado de productos | Grid visual con imágenes de alta calidad, nombre, precio y artesano | Alta |
| Filtros y búsqueda | Por categoría, precio, artesano, material, región de origen | Alta |
| Página de producto | Galería de imágenes, descripción detallada, historia del artesano, variantes | Alta |
| Categorías | Cerámica, textiles, joyería, madera, cuero, vidrio, etc. | Alta |
| Productos relacionados | Sugerencias basadas en categoría y artesano | Media |
| Lista de deseos | Guardar productos favoritos para comprar después | Media |

### 2.2 Integración de Pagos

| Funcionalidad | Descripción | Prioridad |
|---------------|-------------|-----------|
| Pasarela de pago | Integración con Stripe para tarjetas de crédito/débito | Alta |
| Métodos múltiples | Tarjetas, PayPal, transferencia bancaria | Alta |
| Checkout seguro | Proceso de pago cifrado con SSL | Alta |
| Confirmación de pago | Notificación por email y en pantalla | Alta |
| Facturación | Generación automática de recibos/facturas | Media |

### 2.3 Gestión de Inventario

| Funcionalidad | Descripción | Prioridad |
|---------------|-------------|-----------|
| Control de stock | Actualización automática al realizar ventas | Alta |
| Alertas de inventario | Notificación cuando un producto tiene bajo stock | Alta |
| Estado del producto | Disponible, agotado, próximamente | Alta |
| Productos únicos | Manejo de piezas únicas (stock = 1) | Alta |
| Panel de administración | Dashboard para gestionar productos y stock | Alta |

### 2.4 Proceso de Compra

| Etapa | Descripción | Prioridad |
|-------|-------------|-----------|
| Carrito de compras | Agregar, modificar cantidades, eliminar productos | Alta |
| Resumen de orden | Vista previa antes de pagar | Alta |
| Información de envío | Formulario de dirección con validación | Alta |
| Cálculo de envío | Costos según ubicación y peso | Alta |
| Confirmación de pedido | Página de éxito con número de orden | Alta |
| Seguimiento de pedido | Estado del envío en tiempo real | Media |

### 2.5 Gestión de Usuarios

| Funcionalidad | Descripción | Prioridad |
|---------------|-------------|-----------|
| Registro/Login | Autenticación por email y contraseña | Alta |
| Perfil de usuario | Datos personales, direcciones guardadas | Alta |
| Historial de pedidos | Lista de compras anteriores | Alta |
| Recuperación de contraseña | Flujo de reset por email | Alta |

---

## 3. Requisitos Técnicos

### 3.1 Stack Tecnológico

```
Frontend:
├── Next.js 16 (App Router)
├── React 19
├── TypeScript
├── Tailwind CSS
└── shadcn/ui

Backend:
├── Next.js API Routes / Server Actions
├── Base de datos: Supabase (PostgreSQL)
└── Autenticación: Supabase Auth

Pagos:
└── Stripe Checkout

Almacenamiento:
└── Vercel Blob (imágenes de productos)

Despliegue:
└── Vercel
```

### 3.2 Estructura de Base de Datos

**Tablas principales:**

- **products**: id, name, description, price, category_id, artisan_id, images, stock, created_at
- **categories**: id, name, slug, description, image
- **artisans**: id, name, bio, photo, region, story
- **users**: id, email, name, created_at (gestionado por Supabase Auth)
- **orders**: id, user_id, status, total, shipping_address, created_at
- **order_items**: id, order_id, product_id, quantity, price
- **cart_items**: id, user_id, product_id, quantity

### 3.3 Requisitos de Rendimiento

| Métrica | Objetivo |
|---------|----------|
| Tiempo de carga inicial | < 2 segundos |
| Largest Contentful Paint (LCP) | < 2.5 segundos |
| First Input Delay (FID) | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Tiempo de respuesta del servidor | < 200ms |

### 3.4 Requisitos de Seguridad

- Autenticación segura con tokens JWT
- Protección CSRF en formularios
- Sanitización de inputs
- HTTPS obligatorio
- Row Level Security (RLS) en Supabase
- Encriptación de datos sensibles

---

## 4. Requisitos de Diseño

### 4.1 Principios de Diseño

1. **Autenticidad**: El diseño debe reflejar el carácter artesanal y único de los productos
2. **Simplicidad**: Navegación intuitiva sin elementos innecesarios
3. **Calidez**: Paleta de colores terrosos y naturales
4. **Espacio para las imágenes**: Los productos son el protagonista

### 4.2 Paleta de Colores

| Rol | Color | Uso |
|-----|-------|-----|
| Primario | Terracota (#C67B5C) | Botones principales, acentos |
| Secundario | Verde oliva (#6B705C) | Elementos secundarios |
| Fondo | Crema (#FAF7F2) | Fondo principal |
| Texto | Marrón oscuro (#3D3029) | Textos y títulos |
| Neutro | Gris cálido (#A5A58D) | Bordes, textos secundarios |

### 4.3 Tipografía

- **Títulos**: Serif elegante (ej: Playfair Display)
- **Cuerpo**: Sans-serif legible (ej: Inter o DM Sans)
- **Tamaños**: Sistema escalable desde 14px (cuerpo) hasta 48px (hero)

### 4.4 Componentes Clave

- **Tarjeta de producto**: Imagen grande, hover sutil, información mínima
- **Galería de producto**: Carrusel con zoom y miniaturas
- **Perfil de artesano**: Foto, biografía, productos destacados
- **Carrito lateral**: Drawer que no interrumpe la navegación
- **Checkout**: Proceso en pasos claros y visibles

---

## 5. Experiencia de Usuario (UX)

### 5.1 Flujos Principales

**Flujo de Compra:**
```
Inicio → Explorar/Buscar → Ver Producto → Agregar al Carrito → 
Checkout → Pago → Confirmación
```

**Flujo de Descubrimiento:**
```
Inicio → Categorías/Artesanos → Filtrar → Ver Producto → 
Guardar en Favoritos o Comprar
```

### 5.2 Principios UX

1. **Máximo 3 clics** para completar una compra desde cualquier página
2. **Feedback inmediato** en cada acción (agregar al carrito, enviar formulario)
3. **Persistencia del carrito** aunque el usuario cierre el navegador
4. **Formularios inteligentes** con autocompletado y validación en tiempo real
5. **Diseño responsive** optimizado para móviles (60%+ del tráfico esperado)

### 5.3 Estados de Carga

- Skeletons para listas de productos
- Spinners para acciones puntuales
- Optimistic updates para el carrito
- Lazy loading para imágenes fuera del viewport

---

## 6. Páginas del Sitio

### 6.1 Mapa del Sitio

```
/                           → Página de inicio
/productos                  → Catálogo completo
/productos/[slug]           → Detalle de producto
/categorias/[slug]          → Productos por categoría
/artesanos                  → Listado de artesanos
/artesanos/[slug]           → Perfil de artesano
/carrito                    → Carrito de compras
/checkout                   → Proceso de pago
/cuenta                     → Panel del usuario
/cuenta/pedidos             → Historial de pedidos
/cuenta/pedidos/[id]        → Detalle de pedido
/cuenta/favoritos           → Lista de deseos
/sobre-nosotros             → Historia de la tienda
/contacto                   → Formulario de contacto
```

### 6.2 Página de Inicio

- Hero con imagen destacada y CTA principal
- Productos destacados (4-8 items)
- Categorías principales con iconos/imágenes
- Artesano del mes
- Testimonios de clientes
- Footer con información de contacto y enlaces

---

## 7. Panel de Administración

### 7.1 Funcionalidades Admin

| Sección | Funcionalidades |
|---------|-----------------|
| Dashboard | Ventas del día/semana/mes, pedidos pendientes, productos bajo stock |
| Productos | CRUD completo, gestión de imágenes, variantes |
| Categorías | Crear, editar, ordenar categorías |
| Artesanos | Perfiles, asignación de productos |
| Pedidos | Lista, cambio de estado, detalles |
| Usuarios | Lista de clientes, historial |

---

## 8. Integraciones

### 8.1 Servicios Externos

| Servicio | Propósito |
|----------|-----------|
| Stripe | Procesamiento de pagos |
| Supabase | Base de datos y autenticación |
| Vercel | Hosting y CDN |
| Vercel Blob | Almacenamiento de imágenes |
| Resend/SendGrid | Emails transaccionales |

### 8.2 Emails Automatizados

- Confirmación de registro
- Confirmación de pedido
- Actualización de estado de envío
- Recuperación de contraseña
- Carrito abandonado (opcional)

---

## 9. Métricas de Éxito

### 9.1 KPIs Principales

| Métrica | Objetivo Inicial |
|---------|------------------|
| Tasa de conversión | > 2% |
| Valor promedio de orden | > $50 USD |
| Tasa de abandono de carrito | < 70% |
| Tiempo en sitio | > 3 minutos |
| Páginas por sesión | > 4 |
| Tasa de retorno de usuarios | > 25% |

---

## 10. Fases de Desarrollo

### Fase 1: MVP (4-6 semanas)
- [ ] Estructura base del proyecto
- [ ] Catálogo de productos con filtros
- [ ] Página de detalle de producto
- [ ] Carrito de compras
- [ ] Checkout con Stripe
- [ ] Autenticación de usuarios
- [ ] Panel admin básico

### Fase 2: Mejoras (2-3 semanas)
- [ ] Perfiles de artesanos
- [ ] Lista de deseos
- [ ] Historial de pedidos
- [ ] Emails transaccionales
- [ ] SEO y meta tags

### Fase 3: Optimización (2 semanas)
- [ ] Optimización de rendimiento
- [ ] Analytics y tracking
- [ ] Pruebas de usabilidad
- [ ] Ajustes de UX basados en feedback

---

## 11. Consideraciones Adicionales

### 11.1 Accesibilidad
- Cumplimiento con WCAG 2.1 nivel AA
- Navegación por teclado completa
- Alt text en todas las imágenes
- Contraste de colores adecuado
- Textos legibles y escalables

### 11.2 SEO
- URLs amigables y descriptivas
- Meta tags optimizados por página
- Schema markup para productos
- Sitemap XML automático
- Open Graph para redes sociales

### 11.3 Internacionalización (Futuro)
- Estructura preparada para múltiples idiomas
- Soporte para múltiples monedas
- Configuración regional de formatos

---

## 12. Glosario

| Término | Definición |
|---------|------------|
| SKU | Código único de identificación del producto |
| RLS | Row Level Security - Seguridad a nivel de fila en base de datos |
| CTA | Call to Action - Botón o elemento que invita a una acción |
| MVP | Minimum Viable Product - Versión mínima funcional |
| Checkout | Proceso de finalización de compra |

---

*Este documento sirve como guía para el desarrollo de la plataforma y debe ser revisado y actualizado conforme avance el proyecto.*
