'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, Plus, Trash2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const foodItemSchema = z.object({
    food_id: z.string().min(1, 'Food selection is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
})

const formSchema = z.object({
    meal_name: z.string().min(1, 'Meal name is required'),
    date: z.date({
        required_error: "Date is required",
    }),
    meal_type: z.string().min(1, 'Meal type is required'),
    food_items: z.array(foodItemSchema).min(1, 'At least one food item is required'),
})

type FormData = z.infer<typeof formSchema>

interface FoodsResponse {
    foodId: number;
    foodName: string;
    calories: number;
    carbs: number | null;
    fats: number | null;
    protein: number | null;
    ingredientsIds: { [ingredientId: string]: number };
}

export function MealForm({ onClose }: { onClose: () => void }) {
    const [availableFoods, setAvailableFoods] = useState<FoodsResponse[]>([])
    const [error, setError] = useState<string | null>(null)

    const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            food_items: [{ food_id: '', quantity: 1 }],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "food_items",
    })

    const onSubmit = async (data: FormData) => {
        console.log(data)
        const body = {
            mealName: data.meal_name,
            date: data.date.toISOString().split("T")[0],
            mealType: data.meal_type,
            foodIds: data.food_items.reduce((acc, item) => {
                acc[item.food_id] = item.quantity
                return acc
            }, {} as { [key: string]: number }),
        }

        try {
            const response = await fetch("http://localhost:8080/api/meals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Meal successfully added:", result);
                onClose();
            } else {
                const error = await response.text();
                console.error("Failed to add meal:", error);
                setError('Failed to add meal. Please try again.');
            }
        } catch (error) {
            console.error("Error creating meal:", error)
            setError('Error creating meal. Please check your connection and try again.');
        }
    }

    const fetchFoods = async (): Promise<FoodsResponse[]> => {
        try {
            const response = await fetch("http://localhost:8080/api/foods", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Error fetching foods: ${response.status}`);
            }

            const data: FoodsResponse[] = await response.json();
            console.log('Available foods:', data);
            return data;
        } catch (error) {
            console.error("Error fetching foods:", error);
            setError('Failed to fetch available foods. Please try again later.');
            return [];
        }
    }

    useEffect(() => {
        fetchFoods().then(setAvailableFoods)
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <Label htmlFor="meal_name">Meal Name</Label>
                <Input id="meal_name" {...register('meal_name')} className="mt-1" />
                {errors.meal_name && <p className="text-red-500 text-sm mt-1">{errors.meal_name.message}</p>}
            </div>

            <div>
                <Label htmlFor="date">Date</Label>
                <Controller
                    control={control}
                    name="date"
                    render={({ field }) => (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
            </div>

            <div>
                <Label htmlFor="meal_type">Meal Type</Label>
                <Controller
                    control={control}
                    name="meal_type"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select meal type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                                <SelectItem value="snack">Snack</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.meal_type && <p className="text-red-500 text-sm mt-1">{errors.meal_type.message}</p>}
            </div>

            <div>
                <Label>Food Items</Label>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2 mt-2">
                        <Controller
                            control={control}
                            name={`food_items.${index}.food_id`}
                            rules={{ required: 'Food selection is required' }}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="flex-grow">
                                        <SelectValue placeholder={
                                            availableFoods.length > 0
                                                ? "Select food"
                                                : "No food item logged. Go back to dashboard and log your food first!"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableFoods.map((food) => (
                                            <SelectItem key={food.foodId} value={food.foodId.toString()}>
                                                {food.foodName}, calories: {food.calories}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <Input
                            type="number"
                            {...register(`food_items.${index}.quantity` as const, { valueAsNumber: true, required: 'Quantity is required', min: { value: 1, message: 'Quantity must be at least 1' } })}
                            className="w-20"
                            min={1}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={() => append({ food_id: '', quantity: 1 })}
                    className="mt-2"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Food Item
                </Button>
                {errors.food_items && <p className="text-red-500 text-sm mt-1">{errors.food_items.message}</p>}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit">Create Meal</Button>
            </div>
        </form>
    )
}

