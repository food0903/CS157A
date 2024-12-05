'use client'

import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

interface Food {
    foodId: number;
    foodName: string;
    calories: number;
    carbs: number;
    fats: number;
    protein: number;
}

const formSchema = z.object({
    foodName: z.string().min(1, 'Food name is required'),
    calories: z.number().min(0, 'Calories must be 0 or greater'),
    carbs: z.number().min(0, 'Carbs must be 0 or greater'),
    protein: z.number().min(0, 'Protein must be 0 or greater'),
    fats: z.number().min(0, 'Fats must be 0 or greater'),
})

type FormData = z.infer<typeof formSchema>

interface FoodFormProps {
    food: Food | null;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
}

export function FoodForm({ food, onClose, onSubmit }: FoodFormProps) {
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: food ? {
            foodName: food.foodName,
            calories: food.calories,
            carbs: food.carbs,
            protein: food.protein,
            fats: food.fats,
        } : {
            calories: 0,
            carbs: 0,
            protein: 0,
            fats: 0,
        }
    });

    useEffect(() => {
        if (food) {
            reset(food);
        }
    }, [food, reset]);

    const onSubmitHandler = async (data: FormData) => {
        try {
            await onSubmit(data);
            onClose();
        } catch (err) {
            setError('An error occurred while submitting the form. Please try again.');
        }
    }

    return (
        <Card className="bg-white shadow-lg border-[#F4E0EC] border-4">
            <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
                    <div>
                        <Label htmlFor="foodName">Food Name</Label>
                        <Input
                            id="foodName"
                            {...register('foodName')}
                            className="mt-1"
                        />
                        {errors.foodName && <p className="text-red-500 text-xs mt-1">{errors.foodName.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="calories">Calories</Label>
                        <Input
                            id="calories"
                            type="number"
                            {...register('calories', { valueAsNumber: true })}
                            className="mt-1"
                        />
                        {errors.calories && <p className="text-red-500 text-xs mt-1">{errors.calories.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="carbs">Carbs (g)</Label>
                            <Input
                                id="carbs"
                                type="number"
                                {...register('carbs', { valueAsNumber: true })}
                                className="mt-1"
                            />
                            {errors.carbs && <p className="text-red-500 text-xs mt-1">{errors.carbs.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="protein">Protein (g)</Label>
                            <Input
                                id="protein"
                                type="number"
                                {...register('protein', { valueAsNumber: true })}
                                className="mt-1"
                            />
                            {errors.protein && <p className="text-red-500 text-xs mt-1">{errors.protein.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="fats">Fats (g)</Label>
                            <Input
                                id="fats"
                                type="number"
                                {...register('fats', { valueAsNumber: true })}
                                className="mt-1"
                            />
                            {errors.fats && <p className="text-red-500 text-xs mt-1">{errors.fats.message}</p>}
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className='bg-[#a5aeff] hover:bg-[#5d6dff]'>
                            {food ? 'Update' : 'Create'} Food
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
