-- Create a function to get the word of the day
CREATE OR REPLACE FUNCTION get_word_of_the_day(seed_date text)
RETURNS TABLE (
  id uuid,
  word text,
  created_at timestamptz
) LANGUAGE plpgsql AS $$
DECLARE
  word_count integer;
  offset_val integer;
BEGIN
  -- Get total word count
  SELECT COUNT(*) INTO word_count FROM words;
  
  -- Use the date string as a seed for consistent daily selection
  -- Extract a number from 0 to word_count-1 based on the seed date
  IF word_count > 0 THEN
    -- Simple hash function: sum ASCII values of date string characters
    WITH char_values AS (
      SELECT sum(ascii(c)) as date_sum 
      FROM unnest(string_to_array(seed_date, NULL)) c
    )
    SELECT date_sum % word_count INTO offset_val FROM char_values;
    
    -- Return the selected word
    RETURN QUERY
    SELECT w.id, w.word, w.created_at
    FROM words w
    ORDER BY w.created_at
    LIMIT 1 OFFSET offset_val;
  ELSE
    -- If no words exist, return NULL
    RETURN;
  END IF;
END;
$$;
