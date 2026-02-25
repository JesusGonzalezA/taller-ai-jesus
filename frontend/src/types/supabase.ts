export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          industry: string;
          target_audience: string;
          briefing: string;
          communication_style: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['companies']['Row'],
          'id' | 'created_at' | 'updated_at'
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['companies']['Insert']>;
      };
      social_networks: {
        Row: {
          id: string;
          company_id: string;
          platform: string;
          handle: string;
          style: string;
          audience: string;
          post_frequency: number;
        };
        Insert: Omit<Database['public']['Tables']['social_networks']['Row'], 'id'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['social_networks']['Insert']>;
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          company_id: string | null;
          name: string;
          summary: string;
          source_content: string;
          status: 'draft' | 'generating' | 'generated' | 'exported';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['campaigns']['Row'], 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>;
      };
      publications: {
        Row: {
          id: string;
          campaign_id: string;
          platform: string;
          scheduled_date: string | null;
          copy: string;
          image_prompt: string;
          image_url: string | null;
          hashtags: Json;
          order: number;
          status: 'draft' | 'approved' | 'exported';
        };
        Insert: Omit<Database['public']['Tables']['publications']['Row'], 'id'> & { id?: string };
        Update: Partial<Database['public']['Tables']['publications']['Insert']>;
      };
    };
  };
}
