# Dr. G. Jaya Suma | Academic Portfolio & QLearn Interactive Platform

An advanced, responsive, and aesthetically crafted academic portfolio and interactive learning hub for **Prof. Dr. G. Jaya Suma**, Senior Professor of Information Technology and distinguished university administrator at **Jawaharlal Nehru Technological University Gurajada, Vizianagaram (JNTU-GV)** (Former Registrar).

---

## 🌟 Overview

This web platform showcases the academic journey, research breakthroughs, institutional leadership, and student-centric learning resources of Dr. G. Jaya Suma. It integrates a full-featured course roadmap system and gamified educational puzzles (**QLearn**) alongside a secure administrative CMS.

---

## 🚀 Key Features

### 1. 🎓 Academic Leadership & Profile
- **Career Milestones**: Detailed timeline of academic positions, administrative roles, and institutional governance.
- **Awards & Honors**: State and national accolades, recognitions, and keynote presentations.
- **Educational Background**: Academic credentials from premier institutions.

### 2. 🔬 Research, Publications & Innovations
- **Scholarly Publications**: Indexed research papers (Scopus, Web of Science, IEEE, Springer, Elsevier).
- **Ph.D. Supervision**: Dedicated portal for Ph.D. scholars guided, ongoing research tracks, and thesis topics.
- **Patents & Sponsored Projects**: Innovations, research grants, and consultancy projects.

### 3. 🧠 QLearn Interactive Learning Hub
- **10 Core Technological Domains**:
  1. Quantum Computing
  2. Data Science & Big Data Analytics
  3. Machine Learning & Predictive Modeling
  4. Deep Learning & Neural Architectures
  5. Internet of Things (IoT) & Embedded Systems
  6. Agentic AI & Intelligent Agents
  7. Cloud Computing & Distributed Systems
  8. Cybersecurity & Cryptography
  9. Computer Networks & Security
  10. Software Engineering & Agile Practices
- **Domain Modules**: Structured 10-module curricula, curated video lectures, PPT presentations, and notes.
- **Interactive Subject Word Puzzles**: Timed word connection challenges with score multipliers and hints.
- **Live Leaderboards**: Global and per-subject rankings with real-time scoring.

### 4. 🏛️ Institutional Governance & Symposiums
- **Administrative Contributions**: Contributions to university committees, NAAC/NBA accreditations, and curriculum designs.
- **Faculty Development Programs (FDPs)**: Workshops, national symposiums, and faculty development initiatives organized.
- **Media & Press Coverage**: Filterable gallery of print and digital news coverage, press releases, and campus events.

### 5. 🔐 Administrative Control Panel
- Secure dashboard for managing publications, PhD scholars, announcements, media clippings, and course materials.
- Local storage and Supabase database synchronization support.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS, CSS Custom Properties, Glassmorphism, Custom Theme Tokens
- **UI Components & Icons**: Radix UI primitives, Lucide React Icons, Shadcn UI
- **Animations**: Framer Motion, Tailwind Animate
- **State & Routing**: React Router v6, React Context API, TanStack React Query
- **Data Persistence**: Supabase Client / Local Storage Layer

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or bun

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EmptyEch0/RegistrarMadam_Portfolio.git
   cd RegistrarMadam_Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```plaintext
src/
├── components/
│   ├── admin/         # Admin CMS layouts, forms, and tables
│   ├── home/          # Hero, stats, highlights, and quick links
│   ├── layout/        # Header, Footer, Navigation dropdowns, Mobile Drawer
│   └── ui/            # Radix UI primitives, WordPuzzle, Dialogs, Tooltips
├── pages/
│   ├── HomePage.tsx            # Main landing page
│   ├── AboutPage.tsx           # Biography and leadership philosophy
│   ├── ExperiencePage.tsx      # Academic & administrative journey
│   ├── EducationPage.tsx       # Degrees, credentials & PhD guidance
│   ├── PublicationsPage.tsx    # Research papers and journals
│   ├── AchievementsPage.tsx    # Awards, honors, and recognitions
│   ├── ScholarsPage.tsx        # PhD scholars & research supervision
│   ├── LearningSymposiumPage.tsx # FDPs, workshops, and seminars
│   ├── MediaPage.tsx           # Press clippings and photo gallery
│   ├── QLearnPage.tsx          # QLearn courses, modules, and word puzzles
│   ├── ContactPage.tsx         # Contact info & inquiry form
│   └── admin/                  # Administrative management routes
├── data/              # Static course roadmaps, publications & symposium data
├── hooks/             # Custom React hooks
└── lib/               # Utility functions, supabase client, and helpers
```

---

## 📄 License & Attribution

Designed and maintained for **Dr. G. Jaya Suma**, Professor of Information Technology, JNTU-GV Vizianagaram.  
All rights reserved.
