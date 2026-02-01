# Note & Record Application

A note-taking application with integrated video recording capabilities, built with TypeScript, React, and SQLite.

## Features

- 📝 Rich text note editing with auto-save
- 🎥 Video recording of note creation process
- 📁 Folder organization for notes
- 🔍 Full-text search functionality
- 💾 Local SQLite database storage
- 🎨 Clean, minimalist interface optimized for recording

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
Note App/
├── Asset/Code/          # Source code
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Business logic (database, recording)
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── styles/         # Global styles
├── Tests/              # Test files
├── Docs/               # Documentation
└── public/             # Static assets
```

## Usage

### Creating Notes

1. Click "New Note" in the sidebar
2. Start typing your title and content
3. Notes auto-save every 2 seconds

### Recording

1. Click the "Record" button in the header
2. Create or edit your note while recording
3. Click "Stop" when finished
4. Export your recording as MP4

### Organization

- Create folders to organize notes
- Use the search bar to find notes quickly
- Filter notes by folder

## Technologies

- **Frontend:** React 18 + TypeScript
- **Database:** SQLite (sql.js)
- **Build Tool:** Vite
- **Styling:** CSS Modules + CSS Variables

## License

MIT
