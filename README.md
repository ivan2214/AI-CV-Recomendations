# AI CV Recommendations

Este proyecto utiliza la inteligencia artificial para ofrecer recomendaciones personalizadas de mejora en tu CV en función de una descripción de empleo. Solo necesitas proporcionar tu CV y la descripción del trabajo, y recibirás 10 recomendaciones que te ayudarán a optimizar tu perfil profesional para esa oferta.

## Características

- **Recomendaciones personalizadas**: Se generan 10 recomendaciones específicas para mejorar tu CV en base a la descripción de un trabajo.
- **Integración con Google Gemini AI**: La herramienta utiliza la API de Google Gemini AI para generar recomendaciones.
- **Totalmente gratuito**: No es necesario pagar por las recomendaciones, solo necesitas tu clave de API de Google Gemini AI.
- **Tecnologías utilizadas**:
  - **Next.js** para la creación de la aplicación web.
  - **Shadcn UI** para el diseño de la interfaz de usuario.
  - **SDK de AI de Vercel** para facilitar la integración con IA.

## Requisitos

- Tener una clave de API de Google Gemini AI (puedes obtenerla [aquí](https://gemini.google.com)).
- Node.js y npm instalados en tu máquina.
- Vercel SDK para la integración con IA.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/ai-cv-recommendations.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd ai-cv-recommendations
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Crea un archivo `.env.local` en el directorio raíz y agrega tu clave de API de Google Gemini AI:

   ```bash
   GOOGLE_API_KEY=tu_clave_de_api_aqui
   ```

5. Ejecuta el proyecto:

   ```bash
   npm run dev
   ```

   Esto iniciará el servidor en `http://localhost:3000`.

## Uso

1. Subir tu CV en formato PDF.
2. Introducir la descripción del empleo.
3. Haz clic en el botón "Obtener recomendaciones".
4. Recibirás 10 recomendaciones para optimizar tu CV según la oferta laboral.

## Contribuir

Si quieres contribuir al proyecto, haz un fork del repositorio y crea un Pull Request con tus mejoras.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.