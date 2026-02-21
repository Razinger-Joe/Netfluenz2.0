
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    website: string | null
                    role: 'brand' | 'influencer' | 'admin'
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                    role?: 'brand' | 'influencer' | 'admin'
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    website?: string | null
                    role?: 'brand' | 'influencer' | 'admin'
                }
            }
            campaigns: {
                Row: {
                    id: string
                    created_at: string
                    title: string
                    description: string | null
                    brand_id: string
                    status: 'draft' | 'active' | 'completed' | 'paused'
                    budget: number | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    title: string
                    description?: string | null
                    brand_id: string
                    status?: 'draft' | 'active' | 'completed' | 'paused'
                    budget?: number | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    title?: string
                    description?: string | null
                    brand_id?: string
                    status?: 'draft' | 'active' | 'completed' | 'paused'
                    budget?: number | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
