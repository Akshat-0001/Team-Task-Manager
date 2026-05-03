# Vercel Deployment Guide (Recommended)

Vercel is the easiest way to deploy your React + Vite app. It's made by the creators of Next.js and optimized for frontend frameworks.

## Why Vercel?
- ✅ Zero configuration needed
- ✅ Automatic deployments on every push
- ✅ Free tier with generous limits
- ✅ Global CDN for fast loading
- ✅ Perfect for Vite + React apps
- ✅ Built-in environment variables
- ✅ Automatic HTTPS

## Step-by-Step Deployment

### 1. Sign Up / Login to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 2. Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find your repository: **Akshat-0001/Team-Task-Manager**
3. Click **"Import"**

### 3. Configure Project

Vercel will auto-detect your Vite project. Verify these settings:

**Framework Preset:** Vite
**Root Directory:** `./` (leave as is)
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### 4. Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To get these values:**
- Go to your Supabase project dashboard
- Navigate to Settings → API
- Copy the Project URL and anon/public key

### 5. Deploy!

1. Click **"Deploy"**
2. Wait 1-2 minutes for the build to complete
3. You'll get a URL like: `https://team-task-manager-xyz.vercel.app`

That's it! Your app is live! 🎉

### 6. Update Supabase Settings

Once deployed, update your Supabase project:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to **Site URL**: `https://team-task-manager-xyz.vercel.app`
3. Add to **Redirect URLs**:
   - `https://team-task-manager-xyz.vercel.app/auth/confirm`
   - `https://team-task-manager-xyz.vercel.app/*`

### 7. Update GitHub OAuth (if using)

If you're using GitHub authentication:

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Update your OAuth app:
   - **Homepage URL**: `https://team-task-manager-xyz.vercel.app`
   - Keep the Supabase callback URL as is

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "your changes"
git push
```

Vercel will:
- Detect the push
- Build your app
- Deploy automatically
- Update your live site

You'll get a notification on each deployment!

## Preview Deployments

Every pull request gets its own preview URL:
- Test changes before merging
- Share with team for review
- Automatic cleanup after merge

## Custom Domain (Optional)

To add a custom domain:

1. Go to your Vercel project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain
5. Follow the DNS configuration instructions
6. Update Supabase redirect URLs with your custom domain

## Monitoring & Analytics

Vercel provides:
- **Real-time logs**: See build and runtime logs
- **Analytics**: Page views, performance metrics
- **Speed Insights**: Core Web Vitals
- **Deployment history**: Rollback to any previous version

Access these from your Vercel dashboard.

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Verify environment variables are set correctly
- Make sure all dependencies are in package.json

### Environment Variables Not Working
- Variable names must start with `VITE_`
- Redeploy after adding variables
- Check for typos in variable names

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check Supabase redirect URLs include your Vercel domain
- Ensure GitHub OAuth callback URL is correct

### 404 Errors on Refresh
- The `vercel.json` file handles this with rewrites
- Make sure `vercel.json` is in your repository root

## Cost

Vercel offers:
- **Hobby (Free)**: Perfect for personal projects
  - Unlimited deployments
  - 100GB bandwidth/month
  - Automatic HTTPS
  - Preview deployments
  
- **Pro**: $20/month for commercial projects
  - More bandwidth
  - Team collaboration
  - Advanced analytics

Your app will run perfectly on the free tier!

## Comparison: Vercel vs Railway

| Feature | Vercel | Railway |
|---------|--------|---------|
| Frontend Apps | ⭐⭐⭐⭐⭐ Perfect | ⭐⭐⭐ Good |
| Configuration | Zero config | Needs setup |
| Build Speed | Very fast | Slower |
| Free Tier | Generous | $5 credit |
| Best For | React, Vite, Next.js | Full-stack, backends |

**Recommendation:** Use Vercel for this project! It's designed for exactly what you're building.

## Support

If you encounter issues:
- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: Create an issue in your repository

## Next Steps

After deployment:
1. ✅ Test all features (signup, login, projects, tasks)
2. ✅ Verify GitHub OAuth works
3. ✅ Check email verification flow
4. ✅ Test on mobile devices
5. ✅ Share your live URL!

---

**Your app will be live in under 2 minutes! 🚀**

## Quick Start Commands

```bash
# Already done - your code is on GitHub
# Just go to vercel.com and import your repo!

# For future updates:
git add .
git commit -m "update"
git push  # Vercel auto-deploys!
```
