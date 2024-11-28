package com.example.foodapp.payloads;

public class MealsResponse {

    private Integer mealId;
    private String mealName;
    private String date;
    private String mealType;

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

}
