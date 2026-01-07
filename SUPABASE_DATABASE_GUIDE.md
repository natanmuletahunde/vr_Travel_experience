# 🗄️ Supabase Database Setup Guide

## 📋 Overview

This guide covers everything you need to set up the Supabase database for your VR Travel Experience project.

## 🚀 Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign up"**
3. Choose **GitHub** or **Email** authentication
4. Click **"New Project"**
5. Select your **organization** (or create one)
6. Fill in project details:
   - **Name**: `vr-travel-app` (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
7. Click **"Create new project"**
8. Wait for project to be set up (2-3 minutes)

## 📊 Step 2: Get Your Project Credentials

1. Go to **Project Settings** (gear icon in left sidebar)
2. Navigate to **API** section
3. You'll need these two values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ...`)

## 🔧 Step 3: Set Up Environment Variables

Create/update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🏗️ Step 4: Create Database Tables

Go to **SQL Editor** in Supabase dashboard and run this SQL:

```sql
-- Create destinations table
CREATE TABLE destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  description TEXT,
  panorama_url TEXT NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, destination_id)
);
```

## 🔐 Step 5: Enable Row Level Security (RLS)

```sql
-- Enable RLS on both tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
```

## 📝 Step 6: Set Up Security Policies

```sql
-- Destinations policies
-- Anyone can read destinations (public access)
CREATE POLICY "Public destinations are viewable by everyone" 
ON destinations FOR SELECT USING (true);

-- Only authenticated users can insert destinations
CREATE POLICY "Authenticated users can create destinations" 
ON destinations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own destinations
CREATE POLICY "Users can update their own destinations" 
ON destinations FOR UPDATE USING (auth.role() = 'authenticated');

-- Users can delete their own destinations
CREATE POLICY "Users can delete their own destinations" 
ON destinations FOR DELETE USING (auth.role() = 'authenticated');

-- Favorites policies
-- Users can only see their own favorites
CREATE POLICY "Users can view their own favorites" 
ON favorites FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own favorites
CREATE POLICY "Users can create their own favorites" 
ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites" 
ON favorites FOR DELETE USING (auth.uid() = user_id);
```

## 📸 Step 7: Set Up Storage for Images & Audio

### Create Storage Buckets:

1. Go to **Storage** section in Supabase dashboard
2. Click **"New bucket"**
3. Create two buckets:

#### Bucket 1: `panoramas`
- **Bucket name**: `panoramas`
- **Public bucket**: YES (for public access to images)
- **File size limit**: 50MB (large panoramic images)

#### Bucket 2: `audio`
- **Bucket name**: `audio`
- **Public bucket**: YES (for public access to audio)
- **File size limit**: 10MB

### Set Storage Policies:

```sql
-- Allow public access to panoramas
CREATE POLICY "Public access to panoramas" 
ON storage.objects FOR SELECT USING (bucket_id = 'panoramas');

-- Allow public access to audio
CREATE POLICY "Public access to audio" 
ON storage.objects FOR SELECT USING (bucket_id = 'audio');

-- Allow authenticated users to upload panoramas
CREATE POLICY "Users can upload panoramas" 
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'panoramas' AND auth.role() = 'authenticated'
);

-- Allow authenticated users to upload audio
CREATE POLICY "Users can upload audio" 
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'audio' AND auth.role() = 'authenticated'
);
```

## 🎯 Step 8: Insert Sample Data

```sql
-- Insert sample destinations with real URLs
INSERT INTO destinations (name, country, description, panorama_url, audio_url) VALUES
('Eiffel Tower', 'Paris, France', 
'The iconic iron lattice tower on the Champ de Mars, originally built as the entrance arch for the 1889 World''s Fair. At 324 meters tall, it stands as one of the most recognizable structures in the world.',
'https://your-project-id.supabase.co/storage/v1/object/public/panoramas/eiffel-tower.jpg',
'https://your-project-id.supabase.co/storage/v1/object/public/audio/eiffel-tour.mp3'),

('Great Wall of China', 'Beijing, China',
'An ancient fortification system stretching across northern China, the Great Wall is one of the most impressive architectural feats in human history. Built over centuries by various dynasties.',
'https://your-project-id.supabase.co/storage/v1/object/public/panoramas/great-wall.jpg',
'https://your-project-id.supabase.co/storage/v1/object/public/audio/great-wall.mp3'),

('Colosseum', 'Rome, Italy',
'The largest amphitheater ever built, the Colosseum is an iconic symbol of Imperial Rome and architectural engineering. This massive stone arena held 50,000-80,000 spectators.',
'https://your-project-id.supabase.co/storage/v1/object/public/panoramas/colosseum.jpg',
'https://your-project-id.supabase.co/storage/v1/object/public/audio/colosseum.mp3'),

('Taj Mahal', 'Agra, India',
'A magnificent ivory-white marble mausoleum built between 1632 and 1653 by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal. An eternal symbol of love.',
'https://your-project-id.supabase.co/storage/v1/object/public/panoramas/taj-mahal.jpg',
'https://your-project-id.supabase.co/storage/v1/object/public/audio/taj-mahal.mp3'),

('Statue of Liberty', 'New York, USA',
'A colossal neoclassical sculpture gifted to the United States by France in 1886. Standing on Liberty Island, it symbolizes freedom, democracy, and hope.',
'https://your-project-id.supabase.co/storage/v1/object/public/panoramas/statue-liberty.jpg',
'https://your-project-id.supabase.co/storage/v1/object/public/audio/statue-liberty.mp3'),

('Machu Picchu', 'Cusco, Peru',
'An Incan citadel set high in the Andes Mountains, built in the 15th century and later abandoned. This archaeological wonder showcases sophisticated Inca engineering.',
'https://your-project-id.supabase.co/storage/v1/object/public/panoramas/machu-picchu.jpg',
'https://your-project-id.supabase.co/storage/v1/object/public/audio/machu-picchu.mp3');
```

## 🔑 Step 9: Authentication Setup

### Enable Email Auth:
1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:5173`
3. Under **Redirect URLs**, add: `http://localhost:5173/**`
4. Make sure **"Enable email confirmations"** is checked

### Test Auth:
- Try signing up with a test email
- Check your email for confirmation
- Verify the login process works

## 📊 Step 10: Test Database Connection

### Test in Browser Console:
```javascript
// Open browser console and test:
import { supabase } from './src/services/supabaseClient.js'

// Test connection
supabase.from('destinations').select('*').then(console.log)

// Test auth
supabase.auth.getSession().then(console.log)
```

## 🖼️ Step 11: Upload Media Files

### For Panoramic Images:
1. Go to **Storage** → **panoramas** bucket
2. Click **"Upload"**
3. Upload panoramic images (JPEG/PNG, equirectangular format recommended)
4. Recommended dimensions: 8192x4096px or higher
5. After upload, click on file to get the public URL

### For Audio Files:
1. Go to **Storage** → **audio** bucket  
2. Upload MP3 files (narrations/background music)
3. Recommended format: MP3, 128-320kbps
4. Update destination records with audio URLs

## 🔍 Step 12: Database Monitoring

### Check Table Editor:
1. Go to **Table Editor**
2. Browse `destinations` table - should see sample data
3. Browse `favorites` table - will be empty initially
4. After users sign up and add favorites, data will appear here

### View Real-time Logs:
1. Go to **Logs** section
2. Monitor API calls, errors, and authentication events
3. Useful for debugging database issues

## 🚨 Common Issues & Solutions

### CORS Errors:
```sql
-- Enable CORS for your domain
INSERT INTO cors (origin, allowed_methods, allowed_headers, max_age)
VALUES ('http://localhost:5173', 'GET,POST,PUT,DELETE', 'Authorization,Content-Type', 86400);
```

### Storage Permission Issues:
```sql
-- Double-check storage policies
SELECT * FROM pg_policies WHERE tablename = 'storage';
```

### Auth Not Working:
1. Check email confirmation settings
2. Verify redirect URLs are correct
3. Check browser console for auth errors

## 📱 Step 13: Production Deployment

For production deployment:

1. **Update Environment Variables:**
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

2. **Update Auth Settings:**
- Add production URL to site URLs
- Add production redirect URLs
- Consider enabling email templates

3. **Security Check:**
- Review all RLS policies
- Check storage bucket permissions
- Test with real user accounts

## 🛠️ Database Management Commands

### Reset Development Data:
```sql
-- Clear all data but keep structure
TRUNCATE TABLE favorites RESTART IDENTITY CASCADE;
TRUNCATE TABLE destinations RESTART IDENTITY CASCADE;
```

### Add New Destinations:
```sql
INSERT INTO destinations (name, country, description, panorama_url) VALUES
('New Destination', 'Country', 'Description', 'panorama_url');
```

### Export Data:
```sql
-- Export all destinations
COPY destinations TO 'destinations.csv' WITH CSV HEADER;
```

## 📊 Database Schema Summary

### `destinations` Table:
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Destination name |
| country | TEXT | Country/location |
| description | TEXT | Detailed description |
| panorama_url | TEXT | URL to panoramic image |
| audio_url | TEXT | URL to audio narration |
| created_at | TIMESTAMP | Creation timestamp |

### `favorites` Table:
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| destination_id | UUID | Foreign key to destinations |
| created_at | TIMESTAMP | Creation timestamp |

## 🎉 You're All Set!

Your Supabase database is now fully configured for the VR Travel Experience! 

**Next Steps:**
1. Test the application with real data
2. Upload your own panoramic images
3. Create audio narrations
4. Deploy to production when ready

**For Support:**
- Check Supabase documentation: supabase.com/docs
- Use Supabase Discord for community help
- Check browser console for detailed error messages