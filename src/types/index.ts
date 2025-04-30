export interface Definition {
  id: string;
  word_id: string;
  meaning: string;
  example: string;
  author_id: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  tags: string[];
}

export interface Word {
  id: string;
  word: string;
  created_at: string;
  definitions: Definition[];
}

export interface Vote {
  id: string;
  definition_id: string;
  user_id: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Database {
  public: {
    Tables: {
      words: {
        Row: {
          id: string;
          word: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          word: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          word?: string;
          created_at?: string;
        };
      };
      definitions: {
        Row: {
          id: string;
          word_id: string;
          meaning: string;
          example: string;
          author_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          word_id: string;
          meaning: string;
          example: string;
          author_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          word_id?: string;
          meaning?: string;
          example?: string;
          author_id?: string;
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          definition_id: string;
          user_id: string;
          vote_type: 'up' | 'down';
          created_at: string;
        };
        Insert: {
          id?: string;
          definition_id: string;
          user_id: string;
          vote_type: 'up' | 'down';
          created_at?: string;
        };
        Update: {
          id?: string;
          definition_id?: string;
          user_id?: string;
          vote_type?: 'up' | 'down';
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
      };
      definition_tags: {
        Row: {
          definition_id: string;
          tag_id: string;
        };
        Insert: {
          definition_id: string;
          tag_id: string;
        };
        Update: {
          definition_id?: string;
          tag_id?: string;
        };
      };
    };
    Views: {
      definition_votes: {
        Row: {
          definition_id: string;
          upvotes: number;
          downvotes: number;
        };
      };
    };
  };
}