package com.example.foodapp.payloads;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Map;

public class MealsRequest {

    private String mealName;
    private String date ;
    private String mealType;
    private Map<Integer, Integer> foodIds; 

    public String getMealName() {
        return this.mealName;
    }

    public String getMealType() {
        return this.mealType;
    }


    /**
     * mealDate is String of format yyyy-mm-dd
     * 
     */
    public Date getDate() {

        String[] arr = this.date.split("-");
                
        LocalDate temp = LocalDate.of(Integer.parseInt(arr[0]), Integer.parseInt(arr[1]), Integer.parseInt(arr[2])); 

        return Date.valueOf(temp);
    }

    public Map<Integer, Integer> getFoodIds() {
        return this.foodIds;
    }

    
}