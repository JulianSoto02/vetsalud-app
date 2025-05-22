
# VetSalud App

VetSalud App es una aplicación web diseñada para optimizar los procesos operativos de una clínica veterinaria moderna. Esta SPA (Single Page Application) desarrollada con React y TypeScript, incorpora funcionalidades que permiten gestionar citas, historiales médicos, portal del cliente, notificaciones, reportes y administración, todo desde una interfaz centralizada y fácil de usar.

## 🚀 Tecnologías utilizadas

### Front-end:
- ReactJS + TypeScript
- Tailwind CSS
- React Router
- Context API
- Hooks (useState, useContext, useEffect, useReducer)
- Axios

### Back-end:
- Node.js con Express (carpeta `/server`)
- API REST simulada (sin base de datos, datos en memoria)

## 📁 Estructura del proyecto

```
vetsalud-app/
├── index.html
├── package.json
├── tailwind.config.js
├── server/             ← Back-end simulado
├── src/                ← Front-end SPA
│   ├── components/
│   ├── context/
│   ├── modules/
│   ├── services/
│   └── main.tsx
```

## 🧪 ¿Cómo ejecutar el proyecto?

1. Clona el repositorio:
```bash
git clone https://github.com/TU-USUARIO/vetsalud-app.git
```

2. Instala dependencias:
```bash
npm install
```

3. Ejecuta el proyecto en desarrollo:
```bash
npm run dev
```

> Asegúrate de tener instalado Node.js y Vite.

## 📦 Despliegue

Puedes desplegar esta aplicación fácilmente en Vercel o Netlify (para el front) y Heroku o Render para el back-end simulado.

## 📝 Licencia

Este proyecto es solo para fines educativos.

