package com.example.foodapp.payloads;

public class FoodsRequest {

    private String foodName;
    private Integer calories;
    private Integer carbs;
    private Integer fats;
    private Integer protein;

    public String getFoodName() {
        return this.foodName;
    }
    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public Integer getCalories() {
        return this.calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public Integer getCarbs() {
        return this.carbs;
    }

    public void setCarbs(Integer carbs) {
        this.carbs = carbs;
    }

    public Integer getFats() {
        return this.fats;
    }

    public void setFats(Integer fats) {
        this.fats = fats;
    }

    public Integer getProtein() {
        return this.protein;
    }

    public void setProtein(Integer protein) {
        this.protein = protein;
    }

}
