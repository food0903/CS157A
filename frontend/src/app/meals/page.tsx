'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, UtensilsCrossed, Pencil, Trash2, Info } from 'lucide-react'
import { MealForm } from "@/components/mealForm"
import { MealDetail } from "@/components/MealDetail"

interface Food {
    foodId: number;
    foodName: string;
    quantity: number;
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
}

interface Meal {
    mealId: number;
    userId: number;
    mealName?: string;
    mealType: string;
    date: string;
    foods: Food[];
}

export default function MealsPage() {
    const [meals, setMeals] = useState<Meal[]>([])
    const [error, setError] = useState<string | null>(null);
    const [showMealForm, setShowMealForm] = useState(false);
    const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
    const [showMealDetails, setShowMealDetails] = useState(false);

    const fetchMeals = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/meals", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error('Failed to fetch meals');
            }
            const data: Meal[] = await response.json();
            console.log('Fetched meals:', data);
            setMeals(data);
        } catch (error) {
            console.error("Error fetching meals:", error);
            setError('Failed to load meals. Please try again later.');
        }
    };

    useEffect(() => {
        fetchMeals();
    }, [showMealForm]);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/meals/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                console.log(`Meal with id ${id} deleted successfully`);
                setMeals(meals.filter((meal) => meal.mealId !== id));
            } else {
                const error = await response.text();
                console.error("Failed to delete meal:", error);
                setError('Failed to delete meal. Please try again.');
            }
        } catch (error) {
            console.error("Error deleting meal:", error);
            setError('Error deleting meal. Please check your connection and try again.');
        }
    };

    const handleUpdate = (id: number) => {
        // Placeholder for update functionality
        console.log(`Update meal with id: ${id}`)
    }

    const handleCreateMeal = () => {
        setShowMealForm(true);
    }

    const handleShowMealDetails = (mealId: number) => {
        setSelectedMealId(mealId);
        setShowMealDetails(true);
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-4xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                {!showMealForm && (
                    <Button
                        onClick={handleCreateMeal}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create New Meal
                    </Button>
                )}
                <div>
                    <h1 className="text-3xl font-semibold text-teal-800">Logged Meals</h1>
                    <p className="text-gray-600">Track your daily meals and eating habits</p>
                </div>
            </div>
            {showMealForm ? (
                <MealForm onClose={() => setShowMealForm(false)} />
            ) : meals.length > 0 ? (
                <div className="space-y-4">
                    {meals.map((meal) => (
                        <Card key={meal.mealId} className="bg-white/50 backdrop-blur-sm hover:bg-white/60 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-teal-800">{meal.mealName}</h3>
                                        <time className="text-gray-500 text-sm block">
                                            {new Date(meal.date).toLocaleString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                    </div>
                                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                        {meal.mealType}
                                    </span>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        onClick={() => handleShowMealDetails(meal.mealId)}
                                        variant="outline"
                                        size="sm"
                                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                                    >
                                        <Info className="h-4 w-4 mr-2" />
                                        Details
                                    </Button>
                                    <Button
                                        onClick={() => handleUpdate(meal.mealId)}
                                        variant="outline"
                                        size="sm"
                                        className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                    >
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Update
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(meal.mealId)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
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
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <MealDetail
                mealId={selectedMealId}
                isOpen={showMealDetails}
                onClose={() => setShowMealDetails(false)}
            />
        </div>
    )
}

