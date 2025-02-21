# Go Bravo - Code challenge

## Como correr el proyecto en local

1. Clonar el repositorio.
2. Instalar dependencias.

- Para el proyecto usé el gestor de dependencias de [`pnpm`](https://pnpm.io/), pero si deseas usar `yarn` o `npm` solo elimina el archivo `pnpm-lock.yaml` y corre el comando correspondiente para instalar las dependencias.

```bash
pnpm install
```

3. Clonar el archivo `.env.template` y renombrarlo a `.env`, reemplazar las variables de entorno con los valores correspondientes.

```bash
cp .env.template .env
```

4. Correr el proyecto.

```bash
pnpm dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador y ve el resultado.

## Sobre el proyecto

### Descripción de proyecto

Desarrollar un sistema para consultar el clima de una ciudad de cualquier parte del mundo,
el sistema debe ser capaz de mostrar los detalles de las ciudades que se agreguen como
favoritas y debe cumplir con los siguientes requerimientos:

- Consulta de ciudad

  1. Tener un buscador para consultar cualquier ciudad del mundo.
  2. Mostrar los resultados de las coincidencias de las ciudades con el texto
     ingresado en el buscador.
  3. Tener una opción para poder agregar a favoritos la ciudad deseada.

- Consultar el clima de una ciudad

  4. Seleccionar una ciudad de la lista de favoritos mostrar el clima.
  5. Mostrar el clima actual en grados centígrados, la temperatura mínima y
     máxima.
  6. Mostrar la temperatura por hora para las próximas 24 horas.
  7. Mostrar el clima mínimo y máximo por día por el resto de la semana.

### Principal problema

- El servicio de OpenWeatherMap tiene una gran variedad APIs para hacer diferentes consultas respecto al clima pero, la gran mayoría son de paga. Para resolver el punto `6` y punto `7` y obtener el pronostico de temperatura por hora y el pronostico de temperatura max/min para el resto de la semana, la única APi gratuita que proporciona es [`5 Day / 3 Hour Forecast`](https://openweathermap.org/forecast5) la cual como su nombre lo dice te da el pronostico de temperaturas para 5 días en lapsos de 3 horas.

#### Solución

- La solución al problema del punto `6` fue obtener el clima de la hora actual y solo 8 (porque 8 datos de cada 3 horas implica pronostico para 24 horas) elementos del pronóstico de 5 días en 3 horas, obtener la cantidad de horas "vacías" entre el primer dato y el siguiente en el array y hacer un promedio con sus temperaturas para "predecir" la posible variación de temperatura para cada hora. La solución del punto `7` es algo similar pero con los datos del pronostico para 5 días y hacer el promedio de temperatura máxima y mínima de cada 3 horas.

### Arquitectura usada

La aplicación fue creada con el framework `Next.js` para hacer peticiones al API usando funciones de servidor y mantener oculta el `API key`, `TypeScript` para tener un tipado estricto de los datos y evitar muchos errores en tiempo de ejecución, `Tailwind` para agregar estilos a los componentes y `Zustand` que es un gestor de estado global ligero y potente para almacenar información acerca de las ciudades favoritas y la ciudad que se consulta el clima.

#### Estructura de carpetas

```bash
.
├── public              // todos los assets estáticos
├── src                 // código fuente
│   ├── actions         // Funciones de servidor para hacer consultas al API de OpenWeatherMap
│   ├── app             // Layouts, Paginas y rutas de la aplicación
│   ├── components      // componentes utilizados en las páginas
│   │   ├── ui          // Componentes atómicos
│   │   ├── auth *      // Esta carpeta no existe pero pudieran almacenarse componentes relacionados con la autenticación y seguir este enfoque para cada ruta
│   │   ├── home *
│   ├── lib             // Funciones y utilidades
│   │   ├── definitions // Tipos de datos
│   ├── stores          // Funciones del gestor de estado global
│   ├── hooks *         // Propuesta para hooks personalizados
```

### Trade-offs

Lista de cosas que me gustaría implementar pero no pude debido a tiempo.

- Agregar elementos para accesibilidad en los componentes.
- Agregar tests unitarios y de integración (Hice mucho testing manual para asegurar el buen funcionamiento, pero es una excelente practica para agregar tests automatizados y evitar el testing manual cuando la aplicación crece).
- Funcionalidad para obtener información en diferentes sistemas métricos
- Funcionalidad para hacer una aplicación multi-idioma.
- Mejoras en el UI para mostrar iconos relacionados al clima (soleado, nublado, tormenta eléctrica, etc).
- Mejorar efectos y animaciones en CSS.
