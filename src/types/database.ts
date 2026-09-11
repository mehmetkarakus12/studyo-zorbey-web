/**
 * Supabase veritabanı şema tipleri.
 *
 * Bu dosya `supabase/migrations/` altındaki SQL migration'ları elle yansıtır.
 * Faz 2.1.1'de gerçek projeye (dwectwmlynsomivhkafw) bağlanıp
 * `supabase gen types` çıktısıyla alan bazında karşılaştırıldı — fark
 * bulunmadı. Faz 2.2'de, gerçek tipli sorguların (`.from(...).select(...)`)
 * çalışabilmesi için her tabloya `Relationships`, ve şemaya `Views` /
 * `Functions` alanları eklendi — `@supabase/postgrest-js`'in `GenericTable`/
 * `GenericSchema` kısıtları bunları zorunlu kılıyor; eksik olduklarında
 * TypeScript sorgu sonuçlarını sessizce `never`'a düşürüyordu (Faz 2.2'de
 * admin auth kodu yazılırken bu haliyle keşfedildi ve düzeltildi).
 *
 * İleride şema büyüdükçe bu dosyanın şu komutla üretilen sürümle
 * değiştirilmesi/senkronize edilmesi önerilir:
 *
 *   npx supabase gen types typescript --project-id dwectwmlynsomivhkafw > src/types/database.ts
 *
 * (Bu durumda üretilen çıktıya bu dosyanın altındaki `Tables`/`TablesInsert`/
 * `TablesUpdate` yardımcı export'ları ve literal union tipleri —ProfileRole,
 * LeadStatus vb.— elle geri eklenmeli; `supabase gen types` bunları üretmez.)
 *
 * NOT: Bu dosya ham DB şemasını temsil eder. `src/types/index.ts` içindeki
 * UI/preview tipleriyle (ör. `ServicePreview`) karıştırılmamalıdır — onlar
 * statik ana sayfa verisi için, bu dosyadakiler Supabase tabloları içindir.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = "admin" | "editor";
export type BlogPostStatus = "draft" | "published";
export type LeadStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";
export type ContactMessageStatus = "new" | "read" | "replied" | "archived";
export type VideoType = "youtube" | "vimeo" | "mp4" | "other";

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          role: ProfileRole;
          avatar_url: string | null;
        } & Timestamps;
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          role?: ProfileRole;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          image_url: string | null;
          icon: string | null;
          seo_title: string | null;
          seo_description: string | null;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          image_url?: string | null;
          icon?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
        Relationships: [];
      };
      portfolio_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          is_active: boolean;
        } & Timestamps;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["portfolio_categories"]["Insert"]
        >;
        Relationships: [];
      };
      portfolio_projects: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          slug: string;
          location: string | null;
          shooting_date: string | null;
          short_description: string | null;
          description: string | null;
          cover_image_url: string | null;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: {
          id?: string;
          category_id?: string | null;
          title: string;
          slug: string;
          location?: string | null;
          shooting_date?: string | null;
          short_description?: string | null;
          description?: string | null;
          cover_image_url?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["portfolio_projects"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      portfolio_images: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          alt_text: string | null;
          width: number | null;
          height: number | null;
          sort_order: number;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          alt_text?: string | null;
          width?: number | null;
          height?: number | null;
          sort_order?: number;
          is_cover?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["portfolio_images"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "portfolio_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "portfolio_projects";
            referencedColumns: ["id"];
          },
        ];
      };
      videos: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          thumbnail_url: string | null;
          video_url: string;
          video_type: VideoType;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          thumbnail_url?: string | null;
          video_url: string;
          video_type?: VideoType;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["videos"]["Insert"]>;
        Relationships: [];
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["blog_categories"]["Insert"]
        >;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          category_id: string | null;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image_url: string | null;
          seo_title: string | null;
          seo_description: string | null;
          published_at: string | null;
          status: BlogPostStatus;
          is_featured: boolean;
        } & Timestamps;
        Insert: {
          id?: string;
          category_id?: string | null;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          published_at?: string | null;
          status?: BlogPostStatus;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      appointments: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          service_id: string | null;
          preferred_date: string | null;
          preferred_time: string | null;
          message: string | null;
          status: LeadStatus;
          notes: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email?: string | null;
          service_id?: string | null;
          preferred_date?: string | null;
          preferred_time?: string | null;
          message?: string | null;
          status?: LeadStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["appointments"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      quote_requests: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          service_id: string | null;
          event_date: string | null;
          location: string | null;
          message: string | null;
          status: LeadStatus;
          notes: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email?: string | null;
          service_id?: string | null;
          event_date?: string | null;
          location?: string | null;
          message?: string | null;
          status?: LeadStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["quote_requests"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "quote_requests_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          status: ContactMessageStatus;
        } & Timestamps;
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          status?: ContactMessageStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["contact_messages"]["Insert"]
        >;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          customer_name: string;
          shooting_type: string | null;
          event_date: string | null;
          content: string;
          rating: number | null;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
        } & Timestamps;
        Insert: {
          id?: string;
          customer_name: string;
          shooting_type?: string | null;
          event_date?: string | null;
          content: string;
          rating?: number | null;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["testimonials"]["Insert"]
        >;
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Json;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["site_settings"]["Insert"]
        >;
        Relationships: [];
      };
      seo_settings: {
        Row: {
          id: string;
          page_key: string;
          meta_title: string | null;
          meta_description: string | null;
          canonical_url: string | null;
          og_title: string | null;
          og_description: string | null;
          og_image_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_key: string;
          meta_title?: string | null;
          meta_description?: string | null;
          canonical_url?: string | null;
          og_title?: string | null;
          og_description?: string | null;
          og_image_url?: string | null;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["seo_settings"]["Insert"]
        >;
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          file_name: string;
          file_path: string;
          public_url: string;
          mime_type: string;
          file_size: number | null;
          width: number | null;
          height: number | null;
          alt_text: string | null;
          folder: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_path: string;
          public_url: string;
          mime_type: string;
          file_size?: number | null;
          width?: number | null;
          height?: number | null;
          alt_text?: string | null;
          folder?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["media"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_admin_or_editor: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
