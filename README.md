# 🎯 Team Task Manager

A modern, beautiful task management application built for teams who want to stay organized and productive. Manage projects, assign tasks, and track progress with an intuitive Kanban board interface.

## ✨ Features

- **Kanban Board** - Visualize workflow with To Do → In Progress → Done columns
- **Project Management** - Create and manage multiple projects
- **Team Collaboration** - Add members with admin or member roles
- **Task Management** - Create, assign, and track tasks with priorities and due dates
- **Authentication** - Sign in with email or GitHub OAuth
- **Real-time Updates** - Powered by Supabase
- **Beautiful UI** - Dark theme with smooth animations
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Authentication, Real-time)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **3D Graphics:** Spline
- **Deployment:** Vercel

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Akshat-0001/Team-Task-Manager.git
cd "Team Task Manager"
npm install
```

2. **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Set up Supabase database**

Run the following SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create project_members table
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'To Do' CHECK (status IN ('To Do', 'In Progress', 'Done')),
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
```

4. **Start the development server**
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click "Deploy"

Your app will be live in under 2 minutes! 🎉

**After deployment:**
- Update Supabase Site URL with your Vercel URL
- Add Vercel URL to Supabase Redirect URLs
- Update GitHub OAuth app (if using) with Vercel URL

## 📖 Usage

1. **Sign Up** - Create an account with email or GitHub
2. **Create a Project** - Click "New Project" on the dashboard
3. **Add Team Members** - Invite others by their email
4. **Create Tasks** - Add tasks and assign them to team members
5. **Track Progress** - Move tasks through the Kanban board

### User Roles

- **Admin**: Can create/edit/delete projects and tasks, manage members
- **Member**: Can view projects, update status of assigned tasks

## 🎨 Features Showcase

- **Landing Page** - Beautiful animated hero with floating geometric shapes
- **Authentication** - Smooth login/signup with 3D Spline robot
- **Dashboard** - Overview of all projects with stats
- **Kanban Board** - Drag-free task management with smooth animations
- **Profile Customization** - Choose from 17 unique avatars
- **Dark Theme** - Easy on the eyes with indigo-rose gradient accents

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- **Supabase** - Backend platform
- **Spline** - 3D graphics
- **Vercel** - Deployment platform
- **Lucide** - Icon library
- **Framer Motion** - Animation library

---

Built with ❤️ for modern teams who value beautiful, functional tools.
