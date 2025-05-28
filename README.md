# 🏷️ Sistema de Registro de Productos

Aplicación web monolítica y modular desarrollada con **Flask** para automatizar el registro de nuevos productos en una empresa. Diseñada para facilitar tanto el ingreso manual como la **carga masiva de datos**, con capacidad de impresión de etiquetas en **impresoras Zebra vía IP**.

---

## 🧩 Características principales

- 🔧 Backend construido con **Flask**
- 🎨 Frontend renderizado con **Jinja2**
- 🔄 Comunicación entre frontend y backend mediante **Fetch API / AJAX**
- 🧠 **Chat en tiempo real** entre usuarios mediante **WebSocket**
- 📦 Registro individual y **carga masiva** de productos desde archivos
- 🖨️ Impresión de etiquetas Zebra directamente desde la aplicación (mediante IP)
- 🗃️ Uso de **SQLite para persistencia local** de datos clave
- 🌐 Integración con **MySQL en servidor centralizado**
- 📁 Estructura **modular**, siguiendo el patrón monolítico escalable

---

## 🗂️ Arquitectura

La aplicación sigue una estructura modular dentro de un solo proyecto Flask (monolítico), organizada por funcionalidades.




---

## ⚙️ Funcionalidades

| Función                          | Descripción                                                                 |
|----------------------------------|-----------------------------------------------------------------------------|
| Registro de productos            | Formulario intuitivo para registrar nuevos productos                        |
| Carga masiva                    | Subida de archivos (CSV/Excel) para registrar múltiples productos a la vez |
| Impresión de etiquetas Zebra     | Generación e impresión automática vía IP                                   |
| Chat en tiempo real              | Comunicación instantánea entre usuarios mediante WebSocket                 |
| Persistencia local con SQLite    | Guardado de chats y datos críticos localmente en cada nodo                 |
| Sincronización con MySQL         | Integración con base de datos centralizada en el servidor principal        |
| Comunicación AJAX                | Interfaz fluida sin recargas completas de página                           |

---

## 🖥️ Tecnologías usadas

- **Python 3**
- **Flask**
- **Jinja2**
- **Flask-SocketIO** para WebSocket
- **Fetch API / AJAX**
- **SQLite** para almacenamiento local
- **MySQL** como base de datos centralizada
- **ZPL (Zebra Programming Language)** para etiquetas

---



