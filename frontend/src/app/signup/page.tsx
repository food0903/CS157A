'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import Link from "next/link"

export default function page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Login attempted with:', email, password)
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
                    <h1 className="mt-6 text-3xl font-bold text-teal-800">Meal Tracker!</h1>
                    <p className="mt-2 text-sm text-gray-600">Please sign up your account</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-full border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="Enter your email"
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
                        <div>
                            <Label htmlFor="passwordCheck" className="block text-sm font-medium text-gray-700">
                                Re-enter Password
                            </Label>
                            <Input
                                id="passwordCheck"
                                type="password"
                                value={passwordCheck}
                                onChange={(e) => setPasswordCheck(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-full border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                                placeholder="Re-enter your password"
                            />
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full bg-[#a5aeff] hover:bg-[#5d6dff] text-[#F4F2E0] rounded-full py-3">
                            Sign up
                        </Button>
                    </div>
                </form>
                {/* <div className="text-center">
                    <Link href="/signup" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                        Forgot your password?
                    </Link>
                </div> */}
                <div className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/signin" className="font-medium text-teal-600 hover:text-teal-500">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}

