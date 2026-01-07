# Supabase Authentication Setup Guide

## 1. Project Configuration
- Go to [supabase.com](https://supabase.com)
- Create a new project or use existing one
- Copy your Project URL and Anon Key to `.env` file

## 2. Environment Variables
Create a `.env` file in your project root with:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Auth Settings in Supabase Dashboard

### A. Site URL
- Go to Authentication → Settings
- Set Site URL to: `http://localhost:5173`
- Add redirect URLs: `http://localhost:5173/**`

### B. Email Provider
- In Authentication → Settings → Providers
- Enable "Email" provider
- Set "Confirm email" to your preference:
  - For development: Turn OFF email confirmation
  - For production: Turn ON email confirmation

### C. User Management
- Go to Authentication → Users
- You can manually verify users here if needed

## 4. Database Tables (Optional)
If you want to store user profiles, create a `profiles` table:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT
);

-- Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 5. Testing
- Run your app: `npm run dev`
- Go to `/auth` route
- Try signing up with a test email
- Check Supabase Dashboard → Authentication → Users to see the new user

## 6. Common Issues & Solutions

### "Email address is invalid" Error
- Ensure email format is correct (email@domain.com)
- Check that email provider is enabled in Supabase
- Verify Site URL is configured correctly

### CORS Issues
- Add your development URL to allowed redirect URLs
- Check that Site URL matches your development server

### Email Confirmation
- For development: Disable email confirmation in Auth settings
- For production: Configure SMTP settings in Auth → Email Settings

## 7. Production Deployment
When deploying to production:
1. Update Site URL to your production domain
2. Update redirect URLs to include production domain
3. Enable email confirmation
4. Configure SMTP settings for email delivery
5. Update environment variables with production keys