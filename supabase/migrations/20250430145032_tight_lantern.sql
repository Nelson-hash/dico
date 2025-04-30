/*
  # Initial Schema Setup for Urban Dictionary Clone

  1. New Tables
    - `words`
      - `id` (uuid, primary key)
      - `word` (text, unique)
      - `created_at` (timestamp)
    - `definitions`
      - `id` (uuid, primary key)
      - `word_id` (uuid, foreign key)
      - `meaning` (text)
      - `example` (text)
      - `author_id` (uuid, foreign key)
      - `created_at` (timestamp)
    - `votes`
      - `id` (uuid, primary key)
      - `definition_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `vote_type` (text)
      - `created_at` (timestamp)
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, unique)
    - `definition_tags`
      - `definition_id` (uuid, foreign key)
      - `tag_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create words table
CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create definitions table
CREATE TABLE IF NOT EXISTS definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id uuid REFERENCES words(id) ON DELETE CASCADE,
  meaning text NOT NULL,
  example text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  definition_id uuid REFERENCES definitions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type text CHECK (vote_type IN ('up', 'down')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(definition_id, user_id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

-- Create definition_tags junction table
CREATE TABLE IF NOT EXISTS definition_tags (
  definition_id uuid REFERENCES definitions(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (definition_id, tag_id)
);

-- Enable RLS
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE definition_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read words"
  ON words FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read definitions"
  ON definitions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create definitions"
  ON definitions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authors can update their definitions"
  ON definitions FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Anyone can read votes"
  ON votes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own votes"
  ON votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read tags"
  ON tags FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read definition_tags"
  ON definition_tags FOR SELECT
  TO public
  USING (true);

-- Create views for vote counts
CREATE OR REPLACE VIEW definition_votes AS
SELECT 
  definition_id,
  COUNT(CASE WHEN vote_type = 'up' THEN 1 END) as upvotes,
  COUNT(CASE WHEN vote_type = 'down' THEN 1 END) as downvotes
FROM votes
GROUP BY definition_id;