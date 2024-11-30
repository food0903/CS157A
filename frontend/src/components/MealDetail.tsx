'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Food {
    foodId: number;
    foodName: string;
    calories: number;
    carbs: number | null;
    protein: number | null;
    fats: number | null;
    quantity: number;

}

interface FoodId {
    foodId: number;
    quantity: number;
}

interface Meal {
    mealId: number;
    userId: number;
    mealName?: string;
    mealType: string;
    date: string;
    foodsIds: FoodId[];
}

interface MealDetailsModalProps {
    mealId: number | null;
    isOpen: boolean;
    onClose: () => void;
}

export function MealDetail({ mealId, isOpen, onClose }: MealDetailsModalProps) {
    const [meal, setMeal] = useState<Meal | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [foodList, setFoodList] = useState<Food[]>([]);

    useEffect(() => {
        if (mealId && isOpen) {
            fetchMealDetails(mealId);
        }
    }, [mealId, isOpen]);

    const fetchMealDetails = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/meals/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Error fetching meal: ${response.status}`);
            }

            const mealData: Meal = await response.json();
            console.log("Meal data:", mealData);
            setMeal(mealData);


            const foodDetails = await Promise.all(
                mealData.foodsIds.map(async (foodIdMap) => {
                    // Extract the key (foodId) and value (quantity) from the map
                    const [foodId, quantity] = Object.entries(foodIdMap)[0];

                    const foodResponse = await fetch(`http://localhost:8080/api/foods/${foodId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });

                    if (!foodResponse.ok) {
                        throw new Error(`Error fetching food details for foodId: ${foodId}`);
                    }

                    const foodData = await foodResponse.json();

                    return {
                        ...foodData,
                        quantity: Number(quantity),
                    };
                })
            );

            console.log("Food details:", foodDetails);
            setFoodList(foodDetails);
        } catch (error) {
            console.error("Error fetching meal details:", error);
            setError("Failed to load meal details. Please try again.");
        }
    };

    if (!meal) {
        return null;
    }


    const totalCalories = foodList.reduce((sum, food) => sum + food.calories * food.quantity, 0);
    const totalCarbs = foodList.reduce((sum, food) => sum + (food.carbs ?? 0) * food.quantity, 0);
    const totalProtein = foodList.reduce((sum, food) => sum + (food.protein ?? 0) * food.quantity, 0);
    const totalFats = foodList.reduce((sum, food) => sum + (food.fats ?? 0) * food.quantity, 0);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{meal.mealName || 'Meal Details'}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">
                        {new Date(meal.date).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                    <p className="text-sm font-medium text-teal-600 mt-1">{meal.mealType}</p>
                </div>
                <Card className="mt-4">
                    <CardContent className="p-4">
                        <h4 className="text-sm font-semibold mb-2">Foods:</h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Food Name</TableHead>
                                    <TableHead>Calories</TableHead>
                                    <TableHead>Carbs (g)</TableHead>
                                    <TableHead>Protein (g)</TableHead>
                                    <TableHead>Fats (g)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {foodList.map((food) => (
                                    <TableRow key={food.foodId}>
                                        <TableCell>{food.foodName}</TableCell>
                                        <TableCell>{food.calories}</TableCell>
                                        <TableCell>{food.carbs !== null && food.carbs !== undefined ? food.carbs : "N/A"}</TableCell>
                                        <TableCell>{food.protein !== null && food.protein !== undefined ? food.protein : "N/A"}</TableCell>
                                        <TableCell>{food.fats !== null && food.fats !== undefined ? food.fats : "N/A"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="mt-4 space-y-2">
                    <p className="text-sm"><span className="font-semibold">Total Calories:</span> {totalCalories} cal</p>
                    <p className="text-sm"><span className="font-semibold">Total Carbs:</span> {totalCarbs} g</p>
                    <p className="text-sm"><span className="font-semibold">Total Protein:</span> {totalProtein} g</p>
                    <p className="text-sm"><span className="font-semibold">Total Fats:</span> {totalFats} g</p>
                </div>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </DialogContent>
        </Dialog>
    )
}

