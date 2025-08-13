import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          name: string;
          employee_number: string;
          type: 'CAO' | 'MBV';
          start_date: string;
          years_of_service: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          employee_number: string;
          type: 'CAO' | 'MBV';
          start_date: string;
          years_of_service?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          employee_number?: string;
          type?: 'CAO' | 'MBV';
          start_date?: string;
          years_of_service?: number;
          updated_at?: string;
        };
      };
      keys: {
        Row: {
          id: string;
          key_number: string;
          type: 'A' | 'B' | 'C';
          length: 'kort' | 'lang';
          status: 'available' | 'issued';
          assigned_to: string | null;
          opmerking: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key_number: string;
          type: 'A' | 'B' | 'C';
          length: 'kort' | 'lang';
          status?: 'available' | 'issued';
          assigned_to?: string | null;
          opmerking?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key_number?: string;
          type?: 'A' | 'B' | 'C';
          length?: 'kort' | 'lang';
          status?: 'available' | 'issued';
          assigned_to?: string | null;
          opmerking?: string | null;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          employee_id: string;
          key_id: string;
          action: 'issue' | 'return';
          timestamp: string;
          notes: string | null;
          handled_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          employee_id: string;
          key_id: string;
          action: 'issue' | 'return';
          timestamp?: string;
          notes?: string | null;
          handled_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          employee_id?: string;
          key_id?: string;
          action?: 'issue' | 'return';
          timestamp?: string;
          notes?: string | null;
          handled_by?: string;
        };
      };
    };
  };
}