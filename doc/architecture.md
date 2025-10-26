# AI Resume Builder - Architecture Overview

This document provides a technical overview of the AI Resume Builder's frontend architecture.

## 1. Core Philosophy

The application is a **Single Page Application (SPA)** built with a modern, component-based architecture. The primary goals are to provide a fast, responsive, and interactive user experience. State management is kept as simple as possible, and persistence is handled client-side via the browser's `localStorage`.

## 2. Core Technologies

-   **UI Framework**: [React](https://reactjs.org/) (v19) with TypeScript for building a declarative, type-safe, and component-based user interface.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling approach, enabling rapid development of a responsive and customizable design. It also includes support for dark mode.
-   **AI Integration**: [Google Gemini API](https://ai.google.dev/) via the `@google/genai` SDK. This powers all intelligent features, from content suggestions to dynamic template generation.
-   **PDF Generation**: A combination of `html2canvas` and `jspdf` libraries is used to capture the HTML preview of the resume and convert it into a downloadable PDF document.
-   **Build/Module System**: The project uses a modern module system with ES Modules, relying on an import map for dependency resolution, which is suitable for this no-build-step environment.

## 3. Component Structure

The application is broken down into a hierarchy of reusable components:

-   **`App.tsx`**: The root component. It acts as the main controller, managing global state such as the current theme, authentication status, all user projects, custom templates, and application settings. It is responsible for loading and saving data to `localStorage`.

-   **`CvBuilder.tsx`**: The primary layout component that orchestrates the entire resume editing experience. It manages the layout of its children and adapts to different screen sizes, switching to a tab-based view on mobile.

-   **Sidebars & Navigation**:
    -   `SideMenu.tsx`: A slide-out menu on the far left for navigating between different resume projects.
    -   `Sidebar.tsx`: The main editor sidebar for navigating between different sections of a single resume (e.g., Personal Details, Work Experience).
    -   `TemplateSidebar.tsx`: A view that replaces the sections sidebar, allowing users to select, manage, and create new templates.

-   **Core Content Panels**:
    -   `FormContainer.tsx`: A dynamic container that renders the appropriate input forms for the currently selected resume section. It handles user input and state updates.
    -   `PreviewContainer.tsx`: Renders a live, high-fidelity preview of the resume. It dynamically loads the selected template (either built-in or custom) and populates it with the user's data.

-   **Templates**:
    -   `templates/TemplateClassic.tsx` & `templates/TemplateModern.tsx`: Static, hard-coded React components for the built-in resume designs.
    -   `DynamicTemplateRenderer.tsx`: A powerful component capable of rendering a resume based on a JSON schema. This is the engine that drives the custom, AI-generated templates.

-   **Services**:
    -   `services/geminiService.ts`: A dedicated module that encapsulates all logic for interacting with the Google Gemini API. It provides structured functions for different AI tasks (e.g., generating content, creating a template JSON).

-   **Modals**:
    -   `SettingsModal.tsx`: A dialog for managing application-level settings like the Gemini API key and future database connection details.
    -   `AiTemplateModal.tsx`: A dialog that allows users to prompt the AI to generate a new resume template.

## 4. State Management and Data Flow

-   **Strategy**: The application primarily uses React's built-in state management (`useState`, `useEffect`, `useCallback`). State is "lifted up" to the nearest common ancestor component to be shared among children.
-   **Global State**: `App.tsx` holds all global data (projects, settings, custom templates). This data is passed down to child components via props.
-   **Data Flow**: The data flow is unidirectional. User actions in child components trigger callback functions (e.g., `onUpdateProject`) passed down from `App.tsx`, which then updates the central state. This re-renders the affected components with the new data.
-   **Persistence**: `useEffect` hooks in `App.tsx` are used to watch for changes in the global state. When a change is detected, the state is serialized to JSON and saved to the browser's `localStorage`. On application load, this data is read back from `localStorage` to restore the user's session.

## 5. Responsiveness

The UI is fully responsive and mobile-friendly.
-   **Desktop**: A multi-column layout provides an efficient workspace with the editor and live preview side-by-side.
-   **Mobile**: The layout collapses into a single column. The user can toggle between the "Edit" and "Preview" views using tabs. Sidebars are hidden by default and can be toggled open with dedicated menu buttons. This is achieved using Tailwind CSS's responsive prefixes (e.g., `md:`, `lg:`).
