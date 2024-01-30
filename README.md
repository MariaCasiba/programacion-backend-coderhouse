# Proyecto de E-commerce del Curso de Backend

Este es proyecto de ecommerce del curso de Programación Backend de Coderhouse.
Alumna: María Inés Casiba
Profesor: Federico Osandon
Comisión: 55625 - Año 2023/24
Tutor: Alan Sinicco

## Instalación

1. Clonar este repositorio: `git clone https://github.com/MariaCasiba/programacion-backend-coderhouse.git`
2. Instalar dependencias: `npm install`


## Ejemplos de Uso

Para iniciar la aplicación en modo de desarrollo, ejecuta el siguiente comando:

```bash
npm run start:dev



Rutas Accesibles

Rutas Públicas
GET /: Página principal. Redirige a /products si el usuario está autenticado o a /login si no.
GET /login: Página de inicio de sesión.
GET /register: Página de registro de usuario.
GET /products: Página de productos.

Rutas Protegidas (Requieren Autenticación)
GET /products: Página de productos (requiere autenticación).
GET /product: Página de detalle de un producto (requiere autenticación).
GET /profile: Página de perfil de usuario (requiere autenticación).
GET /logout: Cerrar sesión del usuario. (requiere autenticación).
GET /cart: Página con el carrito de compras (requiere autenticación).
