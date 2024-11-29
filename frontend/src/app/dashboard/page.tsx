import Link from "next/link"
import { UtensilsCrossed, Heart, ChefHat, Salad } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function page() {
    const allCookies = cookies();
    const sessionCookie = allCookies.get("JSESSIONID");

    if (!sessionCookie) {
        redirect('/signin');
    }


    return (
        <div className="min-h-screen bg-[#e0f4e8]">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-[#2d4f4d] mb-12 text-center">
                    What would you like to do?
                </h1>
                <div className="grid gap-6 md:grid-rows-auto max-w-4xl mx-auto">
                    <Link href="/meals">
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-4 border-[#F4E0EC]">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="p-3 rounded-full bg-[#f0f9f6]">
                                    <UtensilsCrossed className="w-8 h-8 text-[#E7BAD5]" />
                                </div>
                                <h2 className="text-xl font-semibold text-[#7c85d1]">Log Meals</h2>
                                <p className="text-center text-muted-foreground">
                                    Track your daily meals and eating habits
                                </p>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/LogDish">
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-4 border-[#F4E0EC]">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="p-3 rounded-full bg-[#f0f9f6]">
                                    <Salad className="w-8 h-8 text-[#E7BAD5]" />
                                </div>
                                <h2 className="text-xl font-semibold text-[#7c85d1]">Log Dish</h2>
                                <p className="text-center text-muted-foreground">
                                    Log your favorite dishes
                                </p>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/logIngredient">
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-4 border-[#F4E0EC]">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="p-3 rounded-full bg-[#f0f9f6]">
                                    <ChefHat className="w-8 h-8 text-[#E7BAD5]" />
                                </div>
                                <h2 className="text-xl font-semibold text-[#7c85d1]">Log Ingredients</h2>
                                <p className="text-center text-muted-foreground">
                                    Keep track of your ingredients
                                </p>
                            </div>
                        </Card>
                    </Link>

                    <Link href="/trackNutrition">
                        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-4 border-[#F4E0EC]">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="p-3 rounded-full bg-[#f0f9f6]">
                                    <Heart className="w-8 h-8 text-[#E7BAD5]" />
                                </div>
                                <h2 className="text-xl font-semibold text-[#7c85d1]">Track Nutrition</h2>
                                <p className="text-center text-muted-foreground">
                                    Monitor your nutritional intake
                                </p>
                            </div>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}

