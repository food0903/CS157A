package com.example.foodapp.payloads;

import java.util.List;
import java.util.Map;

public class MealsResponse {

    private Integer mealId;
    private String mealName;
    private String date;
    private String mealType;
    private List<Map<Integer, Integer>> foodIds;

    public Integer getMealId() {
        return this.mealId;
    }

    public String getMealName() {
        return this.mealName;
    }
    
    public String getDate() {
        return this.date;
    }

    public String getMealType() {
        return this.mealType;
    }

    public List<Map<Integer, Integer>> getFoodsIds() {
        return this.foodIds;
    }

    public void setMealId(Integer i) {
        this.mealId = i;
    }

    public void setMealName(String s) {
        this.mealName = s;
    }

    public void setMealType(String s) {
        this.mealType = s;
    }

    public void setDate(String s) {
        this.date = s;
    }

    public void setFoodIds(List<Map<Integer, Integer>> l) {
        this.foodIds = l;
    }

}
