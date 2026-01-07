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

-- Enable Row Level Security
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Destinations policies (everyone can read, only authenticated can write)
CREATE POLICY "Public destinations are viewable by everyone" ON destinations
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create destinations" ON destinations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own destinations" ON destinations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own destinations" ON destinations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Favorites policies (users can only manage their own favorites)
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Insert sample destinations
INSERT INTO destinations (name, country, description, panorama_url, audio_url) VALUES
('Eiffel Tower', 'Paris, France', 'The iconic iron lattice tower on the Champ de Mars, originally built as the entrance arch for the 1889 World''s Fair. At 324 meters tall, it stands as one of the most recognizable structures in the world and offers breathtaking panoramic views of Paris from its observation decks.', 'https://example.com/panoramas/eiffel-tower.jpg', 'https://example.com/audio/eiffel-tower.mp3'),
('Great Wall of China', 'Beijing, China', 'An ancient fortification system stretching across northern China, the Great Wall is one of the most impressive architectural feats in human history. Built over centuries by various dynasties, this massive structure winds through mountains, deserts, and grasslands, serving as a testament to Chinese civilization''s enduring strength.', 'https://example.com/panoramas/great-wall.jpg', 'https://example.com/audio/great-wall.mp3'),
('Colosseum', 'Rome, Italy', 'The largest amphitheater ever built, the Colosseum is an iconic symbol of Imperial Rome and architectural engineering. This massive stone arena, capable of holding 50,000-80,000 spectators, hosted gladiatorial contests, mock sea battles, and dramatic spectacles that defined Roman entertainment.', 'https://example.com/panoramas/colosseum.jpg', 'https://example.com/audio/colosseum.mp3'),
('Taj Mahal', 'Agra, India', 'A magnificent ivory-white marble mausoleum built between 1632 and 1653 by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal. This architectural masterpiece combines elements from Islamic, Persian, and Indian architectural styles, creating an eternal symbol of love and devotion.', 'https://example.com/panoramas/taj-mahal.jpg', 'https://example.com/audio/taj-mahal.mp3'),
('Statue of Liberty', 'New York, USA', 'A colossal neoclassical sculpture gifted to the United States by France in 1886. Standing on Liberty Island in New York Harbor, Lady Liberty has welcomed immigrants and visitors to America''s shores for over a century, symbolizing freedom, democracy, and hope.', 'https://example.com/panoramas/statue-liberty.jpg', 'https://example.com/audio/statue-liberty.mp3'),
('Machu Picchu', 'Cusco, Peru', 'An Incan citadel set high in the Andes Mountains, built in the 15th century and later abandoned. This archaeological wonder showcases the sophisticated engineering and astronomical knowledge of the Inca civilization, with its precisely cut stone structures and panoramic mountain vistas.', 'https://example.com/panoramas/machu-picchu.jpg', 'https://example.com/audio/machu-picchu.mp3'),
('Santorini', 'Cyclades, Greece', 'A stunning Greek island known for its dramatic cliffs, white-washed buildings with blue domes, and spectacular sunsets over the Aegean Sea. This volcanic island paradise offers unique landscapes, ancient ruins, and some of the most romantic views in the Mediterranean.', 'https://example.com/panoramas/santorini.jpg', 'https://example.com/audio/santorini.mp3'),
('Northern Lights', 'Tromsø, Norway', 'The magical aurora borealis dancing across the Arctic sky in vibrant curtains of green, purple, and blue. This natural phenomenon occurs when charged particles from the sun interact with Earth''s magnetic field, creating one of nature''s most awe-inspiring light shows.', 'https://example.com/panoramas/northern-lights.jpg', 'https://example.com/audio/northern-lights.mp3');