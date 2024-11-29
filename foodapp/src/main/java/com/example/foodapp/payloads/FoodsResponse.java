package com.example.foodapp.payloads;

import java.util.List;
import java.util.Map;

public class FoodsResponse {

    private Integer foodId;
    private String foodName;
    private Integer calories;
    private Integer carbs;
    private Integer fats;
    private Integer protein;
    private List<Map<Integer, Integer>> ingredientsIds;

    public Integer getFoodId() {
        return foodId;
    }

    public void setFoodId(Integer foodId) {
        this.foodId = foodId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public Integer getCarbs() {
        return carbs;
    }

    public void setCarbs(Integer carbs) {
        this.carbs = carbs;
    }

    public Integer getFats() {
        return fats;
    }

    public void setFats(Integer fats) {
        this.fats = fats;
    }

    public Integer getProtein() {
        return protein;
    }

    public void setProtein(Integer protein) {
        this.protein = protein;
    }

    public List<Map<Integer, Integer>> getIngredientsIds() {
        return ingredientsIds;
    }

    public void setIngredientsIds(List<Map<Integer, Integer>> ingredientsIds) {
        this.ingredientsIds = ingredientsIds;
    }
}

