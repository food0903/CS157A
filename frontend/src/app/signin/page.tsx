'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import Link from "next/link"

export default function page() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('sign in with', username, password)
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
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

            if (res.ok) {
                console.log('Login successful:', res);
                location.href = '/dashboard';
            } else {
                console.error('Login failed:', res);
                setErrors('An unexpected error occurred. Please try again.')
            }
        } catch (error) {
            console.error('Error occurred while logging in:', error);
            setErrors('An unexpected error occurred. Please try again.')
        }

    }

    return (
        <div className="min-h-screen bg-[#e0f4e8] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8 space-y-8 border-4 border-[#F4E0EC]">
                <div className="text-center">
                    <Image
                        src="/images/foodLogo.png"
                        width={120}
                        height={120}
                        alt="Cute character"
                        className="mx-auto"
                    />
                    <h1 className="mt-6 text-3xl font-bold text-teal-800">Welcome Back!</h1>
                    <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </Label>
                            <Input
                                id="username"
                                type="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-full border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="Enter your username"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-full border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full bg-[#a5aeff] hover:bg-[#5d6dff] text-[#F4F2E0] rounded-full py-3">
                            Sign in
                        </Button>
                    </div>
                    {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
                </form>
                {/* <div className="text-center">
                    <Link href="/signup" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                        Forgot your password?
                    </Link>
                </div> */}
                <div className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-medium text-teal-600 hover:text-teal-500">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}

