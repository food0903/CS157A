'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, UtensilsCrossed, Pencil, Trash2 } from 'lucide-react'
interface Meal {
    mealId: number;
    userId: number;
    mealName?: string;
    mealType: string;
    date: Date
}


export default function page() {
    const [meals, setMeals] = useState<Meal[]>([])
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchMeals = async () => {
            const response = await fetch("http://localhost:8080/api/meals", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data: Meal[] = await response.json();
            console.log('this is the data: ', data);
            setMeals(data);
        };

        fetchMeals();
    }, []);

    const handleDelete = (id: number) => {
        setMeals(meals.filter(meal => meal.mealId !== id));
    };


    const handleUpdate = (id: number) => {
        // Placeholder for update functionality
        console.log(`Update meal with id: ${id}`)
    }

    const handleCreateMeal = () => {
        // Placeholder for create meal functionality
        console.log('Create new meal')
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <Button
                    onClick={handleCreateMeal}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create New Meal
                </Button>
                <div>
                    <h1 className="text-3xl font-semibold text-teal-800">Logged Meals</h1>
                    <p className="text-gray-600">Track your daily meals and eating habits</p>
                </div>
            </div>
            {meals && meals.length > 0 ? (
                <div className="space-y-4">
                    {meals.map((meal) => (
                        <Card key={meal.mealId} className="bg-white/50 backdrop-blur-sm hover:bg-white/60 transition-colors">
                            <CardContent className="flex items-center p-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-lg font-medium text-teal-800">{meal.mealName}</h3>
                                        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                            {meal.mealType}
                                        </span>
                                    </div>
                                    <time className="text-gray-500 text-sm mt-2 block">
                                        {new Date(meal.date).toLocaleString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </time>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <Button
                                        onClick={() => handleUpdate(meal.mealId)}
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Update meal</span>
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(meal.mealId)}
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete meal</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="bg-white/50 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <UtensilsCrossed className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-center">No meals logged yet. Start tracking your meals by clicking the Create New Meal button.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

