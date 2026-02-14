

export interface ApiProfile {
    username: string;
    email: string;
    avatar: string;

}
export interface ApiEditProfile {
    username: string;
    id: string;
    avatar: string;

}

export interface ApiProfileoResponse {
    status: 'success' | 'error';
    message: string
    data: ApiProfile

}
export interface ApiEditProfileoResponse {
    status: 'success' | 'error';
    message: string
    data: ApiEditProfile

}