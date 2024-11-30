import { Button } from "@/components/ui/button"
import { Utensils, Heart, ChefHat, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { cookies } from "next/headers";

export default function LandingPage() {
  const allCookies = cookies();
  const sessionCookie = allCookies.get("JSESSIONID");

  return (
    <div className="bg-[#e0f4e8] min-h-screen flex items-center justify-center">
      <main className="w-full px-4 py-12 md:py-24">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="w-full md:w-1/2 max-w-2xl flex flex-col items-center md:items-start space-y-6 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-teal-800">
                Meal Tracker!
              </h1>
              <p className="max-w-[700px] text-gray-600 md:text-xl">
                Track your meals and nutrition with ease
              </p>
              <Link href={sessionCookie ? "/dashboard" : "/signin"}>
                <Button className="w-full md:w-auto bg-teal-500 hover:bg-[#BAE7CC] text-white px-8 py-3 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="w-full md:w-1/2 max-w-2xl space-y-8">
              <div className="flex items-start gap-4">
                <Utensils className="h-8 w-8 text-[#E7BAD5] flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#7c85d1]">Log Meals</h3>
                  <p className="text-gray-500">Easily log your daily meals and track your eating habits.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Heart className="h-8 w-8 text-[#E7BAD5] flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#7c85d1]">Track Nutrition</h3>
                  <p className="text-gray-500">Monitor your nutritional intake and maintain a balanced diet.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ChefHat className="h-8 w-8 text-[#E7BAD5] flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#7c85d1]">Customize your Ingredient</h3>
                  <p className="text-gray-500">Enable to keep track of ingredients for food</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

