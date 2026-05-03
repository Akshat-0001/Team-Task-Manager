# Team Task Manager

A task management web app built for teams. Manage projects, assign tasks, and track progress using a Kanban board.

## Features
- Kanban board with To Do → In Progress → Done
- Role-based access (Admin/Member)
- GitHub OAuth + email authentication
- Task priorities, due dates, and overdue warnings
- Real-time collaboration via Supabase

## Tech Stack
- **Frontend:** React 18 + Vite, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL + Auth + Realtime)
- **Other:** React Router v6, Lucide Icons, tsParticles

## Setup

1. Clone and install dependencies
```bash
   git clone https://github.com/Akshat-0001/Team-Task-Manager
   cd "Team Task Manager"
   npm install
```

2. Create a `.env` file:
```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the SQL schema in Supabase (profiles, projects, project_members, tasks tables with RLS enabled)

4. Start the dev server:
```bash
   npm run dev
```

## Usage
- Sign up → Create a project → Add members → Create & assign tasks → Track on Kanban board
- **Admins** can create/edit/delete projects and tasks
- **Members** can view and update task status
---