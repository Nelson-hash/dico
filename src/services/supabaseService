import { supabase } from '../lib/supabase';
import { Word, Definition, Vote, Tag } from '../types';

// Word operations
export async function getWords(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching words:', error);
    throw error;
  }
}

export async function getWordById(id: string) {
  try {
    // Get the word
    const { data: word, error: wordError } = await supabase
      .from('words')
      .select('*')
      .eq('id', id)
      .single();

    if (wordError) throw wordError;

    // Get all definitions for the word with their vote counts
    const { data: definitions, error: defsError } = await supabase
      .from('definitions')
      .select(`
        *,
        definition_votes (upvotes, downvotes)
      `)
      .eq('word_id', id);

    if (defsError) throw defsError;

    // Format the definitions to match our type structure
    const formattedDefinitions = await Promise.all(definitions.map(async (def) => {
      // Get tags for this definition
      const { data: defTags, error: tagsError } = await supabase
        .from('definition_tags')
        .select(`
          tags (name)
        `)
        .eq('definition_id', def.id);

      if (tagsError) throw tagsError;

      // Format the tags
      const tags = defTags.map(tag => tag.tags.name);

      // Format the votes
      const voteData = def.definition_votes[0] || { upvotes: 0, downvotes: 0 };

      return {
        id: def.id,
        word_id: def.word_id,
        meaning: def.meaning,
        example: def.example,
        author_id: def.author_id,
        created_at: def.created_at,
        upvotes: voteData.upvotes,
        downvotes: voteData.downvotes,
        tags,
      };
    }));

    // Return the word with its definitions
    return {
      ...word,
      definitions: formattedDefinitions,
    };
  } catch (error) {
    console.error('Error fetching word by ID:', error);
    throw error;
  }
}

export async function searchWords(query: string) {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .ilike('word', `%${query}%`)
      .limit(20);

    if (error) throw error;

    // For each word, get definitions
    const wordsWithDefinitions = await Promise.all(data.map(async (word) => {
      return await getWordById(word.id);
    }));

    return wordsWithDefinitions;
  } catch (error) {
    console.error('Error searching words:', error);
    throw error;
  }
}

export async function getRandomWord() {
  try {
    // Get the total count of words
    const { count, error: countError } = await supabase
      .from('words')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Generate a random offset
    const randomOffset = Math.floor(Math.random() * count);

    // Get a random word
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .range(randomOffset, randomOffset)
      .limit(1)
      .single();

    if (error) throw error;

    // Get full word data with definitions
    return await getWordById(data.id);
  } catch (error) {
    console.error('Error fetching random word:', error);
    throw error;
  }
}

export async function getTrendingWords(limit = 5) {
  try {
    // Get words with most definitions added in the last 7 days
    const { data, error } = await supabase
      .from('words')
      .select(`
        *,
        definitions!inner (id, created_at)
      `)
      .gte('definitions.created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('id', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Get full word data with definitions
    const wordsWithDefinitions = await Promise.all(data.map(async (word) => {
      return await getWordById(word.id);
    }));

    return wordsWithDefinitions;
  } catch (error) {
    console.error('Error fetching trending words:', error);
    throw error;
  }
}

export async function getWordOfTheDay() {
  try {
    // Today's date in YYYY-MM-DD format to get a consistent word for the day
    const today = new Date().toISOString().split('T')[0];
    
    // Use the date as a seed for selecting a word
    const { data, error } = await supabase
      .rpc('get_word_of_the_day', { seed_date: today });

    if (error) throw error;

    // Get full word data with definitions
    return await getWordById(data.id);
  } catch (error) {
    console.error('Error fetching word of the day:', error);
    
    // Fallback to a random word if the function fails
    return await getRandomWord();
  }
}

// Definition operations
export async function addDefinition(wordId: string, definition: Omit<Definition, 'id' | 'word_id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('definitions')
      .insert({
        word_id: wordId,
        meaning: definition.meaning,
        example: definition.example,
        author_id: definition.author_id,
      })
      .select()
      .single();

    if (error) throw error;

    // Add tags if provided
    if (definition.tags && definition.tags.length > 0) {
      for (const tagName of definition.tags) {
        // First, ensure the tag exists
        const { data: tagData, error: tagError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', tagName)
          .single();

        let tagId;
        if (tagError) {
          // Tag doesn't exist, create it
          const { data: newTag, error: newTagError } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select()
            .single();

          if (newTagError) throw newTagError;
          tagId = newTag.id;
        } else {
          tagId = tagData.id;
        }

        // Now link the tag to the definition
        const { error: linkError } = await supabase
          .from('definition_tags')
          .insert({
            definition_id: data.id,
            tag_id: tagId,
          });

        if (linkError) throw linkError;
      }
    }

    return data;
  } catch (error) {
    console.error('Error adding definition:', error);
    throw error;
  }
}

export async function voteOnDefinition(definitionId: string, userId: string, voteType: 'up' | 'down') {
  try {
    // Check if user has already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('*')
      .eq('definition_id', definitionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingVote) {
      // User has already voted, update their vote
      const { error: updateError } = await supabase
        .from('votes')
        .update({ vote_type: voteType })
        .eq('id', existingVote.id);

      if (updateError) throw updateError;
    } else {
      // User hasn't voted, insert new vote
      const { error: insertError } = await supabase
        .from('votes')
        .insert({
          definition_id: definitionId,
          user_id: userId,
          vote_type: voteType,
        });

      if (insertError) throw insertError;
    }

    return true;
  } catch (error) {
    console.error('Error voting on definition:', error);
    throw error;
  }
}

// Word submission
export async function submitWord(word: string, definition: Omit<Definition, 'id' | 'word_id' | 'created_at'>) {
  try {
    // First, check if the word already exists
    const { data: existingWord, error: checkError } = await supabase
      .from('words')
      .select('id')
      .ilike('word', word)
      .maybeSingle();

    if (checkError) throw checkError;

    let wordId;
    if (existingWord) {
      // Word already exists, use its ID
      wordId = existingWord.id;
    } else {
      // Word doesn't exist, create it
      const { data: newWord, error: insertError } = await supabase
        .from('words')
        .insert({ word })
        .select()
        .single();

      if (insertError) throw insertError;
      wordId = newWord.id;
    }

    // Now add the definition
    const newDefinition = await addDefinition(wordId, definition);

    return { word: { id: wordId, word }, definition: newDefinition };
  } catch (error) {
    console.error('Error submitting word:', error);
    throw error;
  }
}
