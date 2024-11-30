"use server"
import { sessionOptions, SessionData, defaultSession } from './libs';
import { getIronSession } from 'iron-session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const getSession = async () => {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (!session.isLogged) {
        session.isLogged = defaultSession.isLogged;
    }


    return session;
}


export const getClientSession = async () => {
    const session = await getSession();
    if (!session.isLogged) {
        session.isLogged = defaultSession.isLogged;
    }

    const clientSession = {
        isLogged: session.isLogged,
        username: session.username,
    }

    return clientSession;
}

export const loginSession = async (username: string, password: string) => {
    const session = await getSession();
    console.log('test actions', username, password)

    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
            credentials: 'include',
        });

        const message = await response.text();

        if (response.ok) {
            console.log('Login successful:', message);
            session.isLogged = true;
            session.username = username;
            await session.save();

        } else {
            console.error('Login failed:', message);
            return message
        }
    } catch (error) {
        console.error('Error occurred while logging in:', error);
        return 'An unexpected error occurred. Please try again.'
    }

}

export const registerSession = async (username: string, password: string, passwordCheck: string) => {
    const session = await getSession();

    if (password !== passwordCheck) {
        return 'Passwords do not match. Please try again.';
    }

    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const message = await response.text();

        if (response.ok) {
            console.log('Registration successful:', message);

            const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
                credentials: 'include',
            });

            const loginMessage = await loginResponse.text();

            if (loginResponse.ok) {
                session.isLogged = true;
                session.username = username;
                await session.save();

            } else {
                return loginMessage;
            }

        } else {
            console.error('Registration failed:', message);
            return message;
        }
    } catch (error) {
        console.error('Error occurred while registering:', error);
        return 'An unexpected error occurred. Please try again.';
    }
}

export const logoutSession = async () => {
    const session = await getSession();
    session.destroy();

    if (typeof window !== 'undefined') {
        window.location.href = '/'
    } else {
        redirect('/')
    }
}
