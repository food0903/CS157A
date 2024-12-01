'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PlusCircle, Salad, Pencil, Trash2, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FoodForm } from '@/components/foodForm'

interface Food {
    foodId: number;
    foodName: string;
    calories: number;
    carbs: number;
    fats: number;
    protein: number;
}

export default function FoodsPage() {
    const [foods, setFoods] = useState<Food[]>([])
    const [error, setError] = useState<string | null>(null);
    const [showFoodForm, setShowFoodForm] = useState(false);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [showFoodDetails, setShowFoodDetails] = useState(false);

    const fetchFoods = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/foods", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error('Failed to fetch foods');
            }
            const data: Food[] = await response.json();
            console.log('Fetched foods:', data);
            setFoods(data);
        } catch (error) {
            console.error("Error fetching foods:", error);
            showError('Failed to load foods. Please try again later.');
        }
    };

    const showError = (message: string) => {
        setError(message);
        setTimeout(() => {
            setError(null);
        }, 2000);
    };

    useEffect(() => {
        fetchFoods();
    }, [showFoodForm, selectedFood]);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/foods/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.ok) {
                console.log(`Food with id ${id} deleted successfully`);
                setFoods(foods.filter((food) => food.foodId !== id));
            } else {
                const error = await response.text();
                console.error("Failed to delete food:", error);
                showError(error);
            }
        } catch (error) {
            console.error("Error deleting food:", error);
            showError('Failed to delete food. Please try again.');
        }
    };

    const handleUpdate = (food: Food) => {
        setSelectedFood(food);
        setShowFoodForm(true);
    }

    const handleCreateFood = () => {
        setSelectedFood(null);
        setShowFoodForm(true);
    }

    const handleCreateOrUpdateFood = async (foodData: Omit<Food, 'foodId'>) => {
        try {
            if (selectedFood) {
                const response = await fetch(`http://localhost:8080/api/foods/${selectedFood.foodId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(foodData),
                });
                if (!response.ok) {
                    throw new Error('Failed to update food');
                }

            } else {
                const response = await fetch('http://localhost:8080/api/foods', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(foodData),
                });
                if (!response.ok) {
                    throw new Error('Failed to create food');
                }
            }
            setShowFoodForm(false);
        } catch (error) {
            console.error("Error creating/updating food:", error);
            showError('An error occurred while submitting the form. Please try again.');
        }
    };

    const handleShowDetails = (food: Food) => {
        setSelectedFood(food);
        setShowFoodDetails(true);
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                {!showFoodForm && (
                    <Button
                        onClick={handleCreateFood}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Add New Food
                    </Button>
                )}
                <div>
                    <h1 className="text-3xl font-semibold text-emerald-800">Food Library</h1>
                    <p className="text-gray-600">Explore and manage your food items</p>
                </div>
            </div>

            {showFoodForm ? (
                <FoodForm
                    food={selectedFood}
                    onClose={() => setShowFoodForm(false)}
                    onSubmit={handleCreateOrUpdateFood}
                />
            ) : foods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {foods.map((food) => (
                        <Card key={food.foodId} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-emerald-700 mb-2">{food.foodName}</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p><span className="font-medium">Calories:</span> {food.calories} kcal</p>
                                    <p><span className="font-medium">Carbs:</span> {food.carbs}g</p>
                                    <p><span className="font-medium">Protein:</span> {food.protein}g</p>
                                    <p><span className="font-medium">Fats:</span> {food.fats}g</p>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-[#e0f4f2] p-4 flex justify-end gap-2">
                                <Button
                                    onClick={() => handleShowDetails(food)}
                                    variant="outline"
                                    size="sm"
                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                                >
                                    <Info className="h-4 w-4 mr-2" />
                                    Details
                                </Button>
                                <Button
                                    onClick={() => handleUpdate(food)}
                                    variant="outline"
                                    size="sm"
                                    className="text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => handleDelete(food.foodId)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="bg-white/50 backdrop-blur-sm">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <Salad className="h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 text-center">Your food library is empty. Start by adding some foods!</p>
                    </CardContent>
                </Card>
            )}

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            {selectedFood && showFoodDetails && (
                <Dialog open={showFoodDetails} onOpenChange={setShowFoodDetails}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-emerald-700">{selectedFood.foodName}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-emerald-700">Calories</p>
                                    <p className="mt-1 text-2xl font-semibold">{selectedFood.calories} kcal</p>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-blue-700">Carbohydrates</p>
                                    <p className="mt-1 text-2xl font-semibold">{selectedFood.carbs}g</p>
                                </div>
                                <div className="bg-amber-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-amber-700">Protein</p>
                                    <p className="mt-1 text-2xl font-semibold">{selectedFood.protein}g</p>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <p className="text-sm font-medium text-red-700">Fats</p>
                                    <p className="mt-1 text-2xl font-semibold">{selectedFood.fats}g</p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

