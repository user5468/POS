# Depósito San Juditas - Sistema POS

Sistema de Punto de Venta completo y minimalista para gestión de inventario, ventas, clientes y más.

## Características

### 🏪 Punto de Venta (POS)
- Búsqueda de productos por nombre o código de barras
- Soporte para escáner de códigos de barras
- Carrito de compras con cantidades editables
- Múltiples métodos de pago (efectivo, tarjeta, transferencia)
- Cálculo automático de cambio
- Sistema de kits/paquetes con descuento automático
- Modo consumo propio con autorización
- Sistema de cupones de descuento
- Impresión de tickets optimizada para 58mm

### 📦 Inventario
- Gestión completa de productos
- Control de stock con alertas de mínimo
- Precios por unidad y por caja
- Categorización de productos
- Búsqueda y filtros avanzados
- Importación/exportación desde Excel
- Imágenes de productos

### 👥 Clientes
- Registro completo de clientes
- Descuentos personalizados
- Sistema de puntos de lealtad
- Historial de compras

### 💳 Cuentas por Cobrar
- Ventas a crédito
- Control de pagos parciales
- Estados automáticos (pendiente, parcial, pagada, vencida)
- Alertas de vencimiento

### 📋 Apartados
- Apartados con pagos parciales
- Fecha límite configurable
- Control de abonos
- Estados automáticos

### 🔄 Devoluciones
- Procesamiento de devoluciones
- Reintegro automático al inventario
- Múltiples métodos de reembolso
- Historial completo

### 📊 Reportes Avanzados
- Reportes por período
- Análisis por producto
- Reportes por cajero
- Análisis de ganancias
- Exportación a Excel

### 🎁 Promociones y Cupones
- Creación de promociones
- Sistema de cupones
- Validación automática
- Aplicación en POS

### 📦 Kits/Paquetes
- Creación de kits con múltiples productos
- Precio especial para kits
- Cálculo automático de descuento
- Control de inventario de componentes

### 💰 Corte de Caja
- Apertura con monto inicial
- Resumen por método de pago
- Cierre con conteo de efectivo
- Detección de diferencias

### 🔧 Ajustes de Inventario
- Registro de entradas/salidas
- Control de mermas
- Historial completo

### 👤 Gestión de Usuarios
- Roles: Administrador y Vendedor
- Permisos diferenciados
- Control de acceso

### ⚙️ Configuración
- Datos de la empresa
- Configuración de impuestos
- Preferencias del sistema
- Backup y restauración

## Tecnologías

- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Context API** - Estado global
- **LocalStorage** - Persistencia de datos

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## Uso

### Credenciales por defecto

- **Administrador:** admin / admin123
- **Vendedor:** vendedor / vendedor123

### Primeros pasos

1. Inicia sesión con las credenciales de administrador
2. Configura los datos de tu empresa en Configuración
3. Agrega productos al inventario
4. Comienza a vender desde el Punto de Venta

## Estructura del Proyecto

```
src/
├── App.tsx                 # Componente principal con todas las páginas
├── main.tsx               # Punto de entrada
├── index.css              # Estilos globales
└── context/
    ├── AuthContext.tsx     # Autenticación
    ├── DataContext.tsx     # Productos y ventas
    ├── AlertContext.tsx    # Notificaciones
    ├── ConfigContext.tsx   # Configuración
    ├── ExtendedContext.tsx # Clientes, cuentas, devoluciones, apartados
    ├── KitsContext.tsx     # Kits/paquetes
    └── PromotionsContext.tsx # Promociones y cupones
```

## Diseño

La aplicación utiliza un diseño minimalista con:
- Tipografía reducida (12-14px)
- Paleta de colores sobria (grises, negro, blanco)
- Sin emojis, solo texto y caracteres Unicode
- Interfaz limpia y profesional
- Responsive para todos los dispositivos

## Persistencia de Datos

Todos los datos se guardan en localStorage del navegador:
- Productos
- Ventas
- Clientes
- Cuentas por cobrar
- Apartados
- Devoluciones
- Kits
- Promociones
- Cupones
- Configuración

## Características Destacadas

✅ **Sin dependencias de iconos** - Usa solo texto y caracteres Unicode
✅ **Persistencia local** - Todos los datos se guardan en localStorage
✅ **Sistema de alertas** - Notificaciones visuales para todas las acciones
✅ **Diseño responsive** - Funciona en desktop, tablet y móvil
✅ **Búsqueda avanzada** - Filtros en todas las secciones
✅ **Exportación a Excel** - Reportes en formato XLSX
✅ **Control de acceso** - Roles y permisos por usuario
✅ **Modo offline** - Funciona sin conexión a internet

## Soporte

Para soporte técnico o consultas, contactar al administrador del sistema.

---

**Depósito San Juditas - Sistema POS v1.0**
