export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    is_admin: boolean;
}

export interface PostMedia {
    id: number;
    post_id: number;
    file_path: string;
    type: 'image' | 'video' | 'pdf';
    url?: string;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: number;
    user_id: number;
    post_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user: User;
}

export interface Post {
    id: number;
    user_id: number;
    status: 'draft' | 'published';
    title: string;
    description?: string;
    created_at: string;
    updated_at: string;
    user: User;
    media: PostMedia[];
    comments: Comment[];
    likes_count?: number;
    favorites_count?: number;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    locale: string;
    translations: {
        app: Record<string, string>;
    };
};
