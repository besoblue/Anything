# Product Requirements Document: Anything

## Project Overview

**Product Name:** Anything

**Vision:** A note-taking application that records the entire note creation process as a video, allowing users to share not just their final thoughts, but the journey of how those thoughts developed. This creates a more engaging and familiar viewing experience for audiences who can follow along as notes are created in real-time.

**Technology Stack:**
- **Frontend:** React with TypeScript
- **Database:** SQLite for local-first data persistence
- **Video Recording:** Browser-based screen/canvas recording APIs
- **Build Tool:** Vite (recommended for modern React + TypeScript development)

**Target Audience:** 
- Content creators who want to share their thought processes
- Educators creating tutorial content
- Students documenting their learning journey
- Professionals sharing meeting notes or brainstorming sessions

---

## Key Differentiators

### 1. **Familiar Note-Taking Experience**
The interface prioritizes a clean, distraction-free note-taking experience that audiences will recognize. When viewers watch the recording, they see a familiar interface (similar to Apple Notes, Google Keep, or Notion) rather than a complex or unfamiliar tool.

### 2. **Recording-Aware Design**
Every UI element is designed with the understanding that it will be recorded and watched by an audience:
- Clean, readable typography
- Smooth, intentional animations
- Clear visual hierarchy
- Minimal UI chrome that doesn't distract from content

### 3. **Seamless Recording Integration**
Recording happens in the background without interrupting the note-taking flow:
- One-click start/stop recording
- Automatic video generation and export
- Export size option for vertical and horizontal viewing
- Optional audio narration support in Chinese and English or both

---

## Design Principles & Style Guide

### Visual Design Philosophy

**Minimalist & Clean**
- Embrace whitespace and breathing room
- Remove unnecessary UI elements during recording mode
- Focus attention on the content being created

**Familiar & Approachable**
- Draw inspiration from established note-taking apps (Apple Notes, Google Keep, Notion)
- Use conventional UI patterns that viewers will recognize
- Avoid custom UI that requires explanation

**Recording-First**
- Every interaction should look intentional on video
- Smooth transitions and animations (no jarring movements)
- Clear visual feedback for all actions
- Readable at standard video resolutions (1080p, 720p)

### Reference Applications

The following applications serve as design inspiration:

#### Apple Notes
![Apple Notes Reference](/Users/fionajiang/.gemini/antigravity/brain/59860b4b-f1c0-42d5-8987-5eb0df80f6a9/uploaded_media_0_1769843890150.jpg)

**Key Takeaways:**
- Clean sidebar with folder organization
- Generous padding and line spacing
- Subtle shadows for depth
- System font for maximum readability
- Timestamp metadata displayed clearly

#### Google Keep / Simple Note-Taking
![Google Keep Style Reference](/Users/fionajiang/.gemini/antigravity/brain/59860b4b-f1c0-42d5-8987-5eb0df80f6a9/uploaded_media_1_1769843890150.jpg)

**Key Takeaways:**
- Tabbed interface for multiple notes
- Formatting toolbar with clear icons
- Character count and metadata in footer
- Clean monospace font option for technical content
- Bullet points and structured lists

#### Minimal Note Interface
![Minimal Interface Reference](/Users/fionajiang/.gemini/antigravity/brain/59860b4b-f1c0-42d5-8987-5eb0df80f6a9/uploaded_media_2_1769843890150.png)

**Key Takeaways:**
- List view with note previews
- Subtle folder organization
- Minimal chrome and distractions
- Focus on content hierarchy

### Typography

**Primary Font:** System font stack for native feel
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

**Monospace Font:** For code or technical notes
```css
font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
```

**Font Sizes:**
- Note Title: 24px (1.5rem), bold (Sidebar only)
- Body Text: 30px (1.875rem), regular (Updated for maximum focus)
- Metadata: 13px (0.8125rem), regular (Sidebar only)
- UI Labels: 14px (0.875rem), medium

**Line Height:** 1.6 for body text (optimal readability)

### Color Palette

**Light Mode (Primary):**
- Background: `#FFFFFF`
- Secondary Background: `#F5F5F7`
- Text Primary: `#1D1D1F`
- Text Secondary: `#86868B`
- Border: `#D2D2D7`
- Accent: `#007AFF` (Apple blue)
- Success: `#34C759`
- Recording Indicator: `#FF3B30`

**Dark Mode (Optional Phase 2):**
- Background: `#1C1C1E`
- Secondary Background: `#2C2C2E`
- Text Primary: `#F5F5F7`
- Text Secondary: `#98989D`
- Border: `#38383A`
- Accent: `#0A84FF`

### Spacing System

Use a consistent 8px base unit:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

### Animation Guidelines

**Timing:**
- Quick interactions: 150ms
- Standard transitions: 250ms
- Complex animations: 350ms

**Easing:**
- Default: `cubic-bezier(0.4, 0.0, 0.2, 1)` (ease-in-out)
- Enter: `cubic-bezier(0.0, 0.0, 0.2, 1)` (ease-out)
- Exit: `cubic-bezier(0.4, 0.0, 1, 1)` (ease-in)

**Recording Considerations:**
- All animations should complete smoothly at 30fps minimum
- Avoid rapid flickering or jarring movements
- Cursor movements should be smooth (consider cursor smoothing)

### Current UI Design Implementation

**App Name & Branding:**
- App name: "Anything" (displayed in black, `#000000`)
- Font size: `var(--font-size-lg)` with `var(--font-weight-semibold)`
- Positioned in header aligned to the left to match editor content alignment

**Color Scheme:**
- Primary grey: `#9CA3AF` (used for icons, inactive buttons, sidebar menu)
- Black: `#000000` (used for app name "Anything")
- Text selection highlight: `#D1D5DB` (light grey)
- Border: `var(--color-border)` (standard border color)

**Header Navigation:**
- Sidebar toggle button: Grey (`#9CA3AF`) with subtle hover background effect
- Record button:
  - Default: Transparent background with grey text (`#9CA3AF`)
  - Hover: Subtle background highlight (`var(--color-hover)`)
  - Font: Large size (`var(--font-size-lg)`) matching app name
  - Style: Minimal with no border or pill shape
  - Recording state: Red background with white text
- Dropdown menu:
  - Appears below Record button on hover
  - Contains Audio toggle (Mic On/Off) and Language selection (English/Chinese/Both)
  - White background with border and shadow
  - Active options highlighted in blue

**Editor Placeholder:**
- Dynamic rotating phrases with typing effect (50ms per character):
  - "Commit to shit"
  - "Your 3 am thoughts"
  - "Ideas that seemed genius at the time"
  - "Better than forgetting"
  - "Your ideas aren't that deep"
- Typing effect only appears when note is empty
- Effect restarts when content is deleted back to empty

**Floating Action Button (New Note):**
- Position: Fixed bottom-right
- Style: Transparent background with grey plus icon (`#9CA3AF`)
- Hover effect: Icon changes to black, scales up (1.1x)
- No background circle or shadow (minimalist design)

**Interactive Elements:**
- Buttons use subtle hover effects (background color change)
- No scale or transform effects on primary buttons (except FAB)
- Consistent use of grey (`#9CA3AF`) for inactive/default states
- Smooth transitions with 0.3s duration

---

## Core Features

### 1. Note Creation & Editing

**Requirements:**
- Rich text editing with markdown support
- Formatting toolbar (bold, italic, lists, headings, links)
- Auto-save every 2 seconds
- Keyboard shortcuts for common actions
- **Default State:** A new blank note is opened automatically on app launch
- **Minimalist FAB:** A minimalist "+" sign positioned in the bottom right corner. No circle or shadow. It transitions from light grey to black on hover.
- **Sidebar Auto-Hide:** Clicking anywhere on the note editor area automatically hides the sidebar if it is currently open.
- **Natural Scrolling:** The note editor view only scrolls when content exceeds viewport space.
- **Manual Overscroll:** 
  - **Automatic Trigger:** When the note content fills the viewport and the user continues typing at the bottom, the editor automatically scrolls so the current line is in the middle of the viewport (creating half a viewport of empty space below).
  - **Manual Padding:** Once the viewport is filled, the editor allows manual scrolling up to 80vh of blank space below the text for a comfortable typing position.

### Sidebar
- **Multi-Selection:** Users can select multiple notes (e.g., via Shift+Click or Cmd/Ctrl+Click) for batch actions.
- **Batch Deletion:** Pressing `Delete` or `Backspace` deletes all currently selected notes after a single confirmation.
...
### Keyboard Shortcuts
- `Cmd + N` (Mac) / `Ctrl + N` (Windows): Create new note
- `Delete` or `Backspace`: Delete selected note(s)

**User Stories:**
- As a user, I can create a new note with a single click
- As a user, I can format text using markdown or toolbar buttons
- As a user, my changes are automatically saved without manual intervention
- As a user, I can see when my note was created and last modified

### 2. Video Recording

**Requirements:**
- One-click recording start/stop
- Record canvas/editor area only (not entire screen)
- Optional audio narration recording
- Visual recording indicator (subtle, non-intrusive)
- Pause/resume functionality
- Maximum recording length: 30 minutes (configurable)
- Export formats: WebM (primary), MP4 (stretch goal)

**User Stories:**
- As a user, I can start recording with one click without leaving the note
- As a user, I can see a clear but subtle indicator that recording is active
- As a user, I can pause recording to gather my thoughts
- As a user, I can export my recording as a video file
- As a user, I can include my voice narration in the recording

**Technical Considerations:**
- Use MediaRecorder API for canvas/stream recording
- Implement chunked recording for memory efficiency
- Store video blobs in IndexedDB temporarily before export
- Provide real-time recording duration display
- Handle browser permissions gracefully

### 3. Note Organization

**Requirements:**
- [ ] Sidebar can be toggled via a button in the header
- [ ] Sidebar is **hidden by default** to maximize focus
- Folder/category system
- [ ] Note list with search functionality
- Sort by: date created, date modified, title
- Filter by folder/category
- Archive functionality (hide without deleting)
- Bulk operations (delete, move, archive)

**User Stories:**
- As a user, I can organize notes into folders
- As a user, I can quickly find notes using search
- As a user, I can archive old notes to declutter my workspace
- As a user, I can move multiple notes to a folder at once

### 4. Data Persistence (SQLite)

**Database Schema:**

```sql
-- Notes table
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  folder_id TEXT,
  created_at INTEGER NOT NULL,
  modified_at INTEGER NOT NULL,
  archived BOOLEAN DEFAULT 0,
  FOREIGN KEY (folder_id) REFERENCES folders(id)
);

-- Folders table
CREATE TABLE folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  created_at INTEGER NOT NULL
);

-- Recordings table
CREATE TABLE recordings (
  id TEXT PRIMARY KEY,
  note_id TEXT NOT NULL,
  duration INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  has_audio BOOLEAN DEFAULT 0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (note_id) REFERENCES notes(id)
);

-- Settings table
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

**Requirements:**
- Use sql.js or better-sqlite3 for SQLite in browser/Electron
- Implement connection pooling for performance
- Automatic database migrations
- Export/import database functionality (backup)
- Optimize queries with proper indexing

### 5. Export & Sharing

**Requirements:**
- Export individual notes as:
  - Markdown (.md)
  - Plain text (.txt)
- Export recordings with associated notes
- Export recordings format option:
  - mp4
- Share recording via:
  - Direct file download
  - Upload to cloud storage (Phase 2)
  - Generate shareable link (Phase 2)

---

## User Interface Components

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Header (App Title, Recording Controls, Settings)  │
├──────────┬──────────────────────────────────────────┤
│          │  Note Header (Title, Metadata)           │
│          ├──────────────────────────────────────────┤
│  Sidebar │  Toolbar (Formatting Options)            │
│  (Notes  ├──────────────────────────────────────────┤
│   List)  │                                          │
│          │  Editor (Main Content Area)              │
│          │                                          │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

### Component Breakdown

#### 1. **AppHeader**
- App name "Anything" (black text, large font matching Record button)
- Sidebar toggle button (hamburger icon in grey)
- Recording controls:
  - Record button (grey text, transparent, minimal style)
  - Recording indicator (time elapsed, red dot in center when recording)
  - Hover dropdown menu with Audio and Language settings
- Static border-bottom line (no animation)

#### 2. **Sidebar**
- Folder list
- Note list (with search)
- "New Note" button
- Folder management
- Collapse/expand functionality

#### 3. **NoteHeader**
- Note title (editable)
- Metadata (created date, modified date)
- Folder/category selector
- Archive/delete actions

#### 4. **FormattingToolbar**
- Text formatting: Bold, Italic, Underline, Strikethrough
- Headings: H1, H2, H3
- Lists: Bullet, Numbered, Checklist
- Insert: Link, Code block
- Alignment options (optional)

#### 5. **Editor**
- Main text editing area
- Dynamic placeholder with rotating phrases and typing animation
- Text selection highlight color: light grey (`#D1D5DB`)
- Markdown rendering (live preview or split view)
- Syntax highlighting for code blocks
- Auto-complete for markdown syntax
- Smooth scrolling

#### 6. **RecordingControls**
- Integrated into AppHeader (not a separate component)
- Record button with hover dropdown containing:
  - Audio toggle: Microphone On/Off
  - Language selection: English, Chinese, or Both
- Recording duration display (shown in center when recording)
- Recording indicator: Red dot with pulsing animation

#### 7. **ExportModal**
- Format selection (video mp4)
- Quality settings for video
- Video Ratio (Phone, Desktop, Square)
- File name input
- Export button
- Progress indicator

---

## User Flows

### Flow 1: Create and Record a Note

1. User enters the app
2. App **automatically creates and opens a blank note** by default
3. Interface is pure: NO title or time information in the note view. Title and metadata are visible only in the sidebar.
4. User begins typing immediately with a very large (30px), legible font
5. User clicks "Start Recording" button
6. Recording indicator appears (red dot + timer)
7. User continues editing note while recording
8. User clicks "Stop Recording" when finished
9. App stops recording and **automatically opens the Export Modal**
10. User selects export options and clicks "Export" or "Cancel"
11. App processes recording and shows success message

### Flow 2: Organize Notes

1. User creates or selects a folder in sidebar
2. User drags note from list to folder
3. Note moves to folder with smooth animation
4. User can rename folder by double-clicking
5. User can delete empty folders

### Flow 3: Export Recording

1. User clicks "Export" button in header
2. Export modal opens
3. User selects format (WebM/MP4) and quality
4. User optionally renames file
5. User clicks "Export" button
6. Progress bar shows encoding progress
7. Browser download dialog appears
8. File downloads to user's system

---

## Technical Architecture

### Frontend Architecture

**Framework:** React 18+ with TypeScript

**State Management:**
- React Context for global state (current note, recording status)
- Local component state for UI interactions
- Custom hooks for reusable logic

**Key Libraries:**
- **Editor:** Draft.js, Slate, or Lexical (rich text editing)
- **Markdown:** remark/rehype (parsing and rendering)
- **Database:** sql.js (SQLite in browser) or better-sqlite3 (Electron)
- **Recording:** MediaRecorder API (native)
- **Styling:** CSS Modules or Styled Components
- **Icons:** Lucide React or Heroicons

### Project Structure

```
Note App/
├── xcode/                          # Xcode project files (if building native macOS/iOS app)
│   └── NoteApp.xcodeproj
├── Asset/
│   └── Code/                       # Main source code directory
│       ├── components/
│       │   ├── AppHeader/
│       │   ├── Sidebar/
│       │   ├── NoteEditor/
│       │   ├── RecordingControls/
│       │   ├── ExportModal/
│       │   └── shared/
│       ├── hooks/
│       │   ├── useRecording.ts
│       │   ├── useDatabase.ts
│       │   ├── useNotes.ts
│       │   └── useAutoSave.ts
│       ├── services/
│       │   ├── database.ts
│       │   ├── recording.ts
│       │   └── export.ts
│       ├── types/
│       │   ├── note.ts
│       │   ├── recording.ts
│       │   └── database.ts
│       ├── utils/
│       │   ├── markdown.ts
│       │   ├── date.ts
│       │   └── file.ts
│       ├── styles/
│       │   ├── globals.css
│       │   ├── variables.css
│       │   └── animations.css
│       ├── App.tsx
│       └── main.tsx
├── Tests/                          # Test files and test utilities
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── Docs/                           # Documentation
│   ├── Research Library/           # Research materials and references
│   └── SPEC.md (this file)
├── public/                         # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Data Flow

```
User Input → React Component → Hook → Service → SQLite Database
                    ↓                              ↓
              UI Update ← State Update ← Query Result
```

**Recording Flow:**
```
Start Recording → MediaRecorder API → Canvas Stream
                        ↓
                  Blob Chunks → IndexedDB (temporary)
                        ↓
                Stop Recording → Process Blobs → Final Video File
                        ↓
                  Save to Database → Export Option
```

---

## Performance Requirements

### Application Performance
- Initial load time: < 2 seconds
- Note switching: < 100ms
- Auto-save operation: < 50ms (non-blocking)
- Search results: < 200ms for 1000+ notes

### Recording Performance
- Recording should not impact typing latency
- Frame rate: minimum 30fps, target 60fps
- Memory usage: < 500MB during 30-minute recording
- Video encoding: real-time or faster

### Database Performance
- Query response time: < 50ms for typical operations
- Support for 10,000+ notes without degradation
- Efficient full-text search indexing

---

## Accessibility Requirements

### Keyboard Navigation
- All features accessible via keyboard
- Logical tab order throughout interface
- Keyboard shortcuts for common actions:
  - `Cmd/Ctrl + N`: New note
  - `Cmd/Ctrl + S`: Manual save (even though auto-save exists)
  - `Cmd/Ctrl + R`: Start/stop recording
  - `Cmd/Ctrl + F`: Search notes
  - `Cmd/Ctrl + B`: Bold text
  - `Cmd/Ctrl + I`: Italic text

### Screen Reader Support
- Proper ARIA labels for all interactive elements
- Semantic HTML structure
- Alt text for icons
- Status announcements for recording state changes

### Visual Accessibility
- WCAG 2.1 AA contrast ratios (4.5:1 for normal text)
- Resizable text up to 200% without breaking layout
- Focus indicators for keyboard navigation
- Support for reduced motion preferences

---

## Security & Privacy

### Data Storage
- All data stored locally (SQLite database)
- No cloud sync in MVP (optional Phase 2)
- User data never leaves device without explicit export

### Recording Privacy
- Clear visual indicator when recording is active
- Microphone permission requested explicitly
- Option to disable audio recording
- Recordings stored locally, not uploaded automatically

### Export Security
- Sanitize file names to prevent directory traversal
- Validate export formats
- No telemetry or analytics in MVP

---

## Development Phases

### Phase 1: MVP (Minimum Viable Product)
**Timeline:** 4-6 weeks

**Features:**
- [ ] Basic note creation and editing
- [ ] Markdown support
- [ ] SQLite database integration
- [ ] Simple folder organization
- [ ] Canvas recording (video only, no audio)
- [ ] WebM export
- [ ] Basic search functionality

**Success Criteria:**
- User can create, edit, and organize notes
- User can record note creation process
- User can export recording as WebM file
- Application runs smoothly without crashes

### Phase 2: Enhanced Features
**Timeline:** 3-4 weeks

**Features:**
- [ ] Audio narration support
- [ ] Pause/resume recording
- [ ] Advanced formatting toolbar
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Export to multiple formats (MP4, markdown, PDF)
- [ ] Recording quality settings

### Phase 3: Polish & Optimization
**Timeline:** 2-3 weeks

**Features:**
- [ ] Performance optimizations
- [ ] Accessibility improvements
- [ ] Advanced search (tags, filters)
- [ ] Bulk operations
- [ ] Database backup/restore
- [ ] Custom themes
- [ ] Recording templates

### Phase 4: Advanced Features (Future)
**Timeline:** TBD

**Features:**
- [ ] Cloud sync (optional)
- [ ] Collaboration features
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] AI-powered transcription
- [ ] Video editing (trim, splice)
- [ ] Direct upload to YouTube/Vimeo

---

## Success Metrics

### User Engagement
- Average notes created per user per week
- Average recording duration
- Percentage of notes that are recorded
- User retention rate (weekly, monthly)

### Technical Performance
- Application crash rate (target: < 0.1%)
- Average load time (target: < 2s)
- Recording success rate (target: > 99%)
- Export success rate (target: > 99%)

### User Satisfaction
- Net Promoter Score (NPS)
- User feedback ratings
- Feature request frequency
- Bug report frequency

---
### Future Enhancements
- Real-time collaboration
- Version history for notes
- Templates for common note types
- Integration with other tools (Notion, Obsidian)
- AI-powered features (summarization, transcription)
- Custom recording overlays (webcam, annotations)

---

## Appendix

### Glossary
- **Canvas Recording:** Recording a specific HTML canvas element rather than the entire screen
- **WebM:** Open-source video format optimized for web
- **SQLite:** Lightweight, file-based relational database
- **Markdown:** Lightweight markup language for formatting text

### References
- [MediaRecorder API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Design Inspiration
- Apple Notes (macOS/iOS)
- Google Keep
- Notion
- Obsidian
- Bear Notes

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-31  
**Author:** Beblue  
**Status:** Draft - Pending Review
