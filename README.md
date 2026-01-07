# 🌍 Virtual Reality Travel Experience

An immersive web-based VR travel application that allows users to explore famous destinations worldwide through 360° panoramic views.

## 🚀 Features

- **🌐 360° Virtual Environments** - Interactive panoramic exploration with smooth controls
- **🎨 Modern Glassmorphic UI** - Beautiful, futuristic design with neon gradients
- **🔐 User Authentication** - Secure sign-up/login with Supabase Auth
- **❤️ Favorites System** - Save and manage your favorite destinations
- **🔊 Audio Narrations** - Immersive audio guides for destinations
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite
- **3D Rendering**: Three.js
- **Styling**: Tailwind CSS with custom glassmorphic effects
- **Backend**: Supabase (Authentication + Database + Storage)
- **Routing**: React Router
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your Supabase URL and anon key
```

4. Start the development server:
```bash
npm run dev
```

## 🗄️ Database Setup

Run the provided SQL script in your Supabase SQL editor:
```bash
# Copy contents of database_schema.sql and run in Supabase
```

## 🌟 Sample Destinations

The app includes sample destinations for demonstration:
- Eiffel Tower (Paris, France)
- Great Wall of China (Beijing, China)  
- Colosseum (Rome, Italy)
- Taj Mahal (Agra, India)
- Statue of Liberty (New York, USA)
- Machu Picchu (Cusco, Peru)
- Santorini (Cyclades, Greece)
- Northern Lights (Tromsø, Norway)

## 🎮 Usage

1. **Explore** - Browse available destinations
2. **View** - Click any destination to enter 360° VR mode
3. **Navigate** - Use mouse/touch to look around the panoramic environment
4. **Learn** - Access information overlays and audio narrations
5. **Save** - Sign in to save favorites to your personal collection

## 🎨 Design Features

- **Glassmorphism** - Modern frosted glass effects
- **Neon Gradients** - Eye-catching color schemes
- **Smooth Animations** - Floating and glowing effects
- **Responsive Layout** - Optimized for all screen sizes

## 🔧 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📱 VR Controls

- **Desktop**: Click and drag to look around
- **Mobile**: Touch and swipe to navigate
- **Info**: Click the info button for destination details
- **Audio**: Use the audio player for narrations

## 🌍 Future Enhancements

- WebXR headset support
- Live video tours
- Multiplayer VR experiences
- AI-generated tour guides
- Offline mode

## 📄 License

MIT License - feel free to use this project for learning and development.

---

**Experience the world from the comfort of your home! 🌏✨**