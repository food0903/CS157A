import { SessionOptions } from 'iron-session';
export interface SessionData {
    username?: string;
    isLogged: boolean;
}

export const defaultSession: SessionData = {
    isLogged: false
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName: 'lama-session',
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    }
}