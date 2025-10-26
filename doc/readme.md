# AI Resume Builder

Welcome to the AI Resume Builder, a modern, intelligent tool designed to help you create a professional and compelling resume with ease. Leveraging the power of Google's Gemini API, this application goes beyond simple editing to provide smart suggestions, dynamic template creation, and a seamless user experience.

## ✨ Features

-   **Intuitive Editor**: A clean, section-based editor that makes entering your information straightforward.
-   **Live Preview**: See your changes reflected instantly in a high-fidelity preview of your resume.
-   **AI-Powered Content**: Get AI-generated suggestions for your professional summary and job descriptions to make your resume stand out.
-   **Multiple Professional Templates**: Choose from a selection of built-in templates (`Classic`, `Modern`).
-   **🤖 AI Template Generation**: Describe a resume style you like, and the AI will create a brand-new template for you on the fly.
-   **Template Import/Export**: Save your custom templates as JSON files and import them later, or share them with others.
-   **Multi-Resume Support**: Create and manage multiple versions of your resume for different job applications.
-   **Persistent Storage**: Your work is automatically saved to your browser's local storage, so you can pick up right where you left off.
-   **PDF Download & Share**: Easily download your finished resume as a pixel-perfect PDF or use your device's native sharing options.
-   **Fully Responsive**: Works beautifully on desktop, tablet, and mobile devices.
-   **Dark Mode**: A sleek dark theme for comfortable viewing in low-light environments.
-   **Configurable Settings**: Add your own Gemini API key and configure future database connections.

## 🚀 Getting Started

This is a browser-based application with no build step required.

1.  **Open `index.html`**: Simply open the `index.html` file in a modern web browser that supports ES Modules (like Chrome, Firefox, Edge, or Safari).
2.  **Start Building**: The application will load, and you can start creating your resume.

## 🔧 Configuration

### Gemini API Key

To enable the AI-powered features (content suggestions, template generation), you must provide your own Google Gemini API key.

1.  **Get a Key**: If you don't have one, you can get a key from [Google AI Studio](https://aistudio.google.com/).
2.  **Enter the Key**:
    -   Click the **Settings** icon (⚙️) in the top right of the preview panel.
    -   Enter your Gemini API key into the input field.
    -   Click **Save**.

Your key will be stored securely in your browser's `localStorage` and will not be shared with any external servers by this application.

## 📁 Project Structure

```
.
├── components/         # Reusable React components
│   ├── templates/      # Built-in resume template components
│   └── ...
├── doc/                # Project documentation
│   ├── architecture.md
│   ├── readme.md
│   └── roadmap.md
├── services/           # Modules for external services (e.g., Gemini API)
├── types.ts            # TypeScript type definitions
├── constants.ts        # Application-wide constants
├── App.tsx             # Main application component
├── index.html          # Entry point of the application
└── index.tsx           # React root renderer
```
