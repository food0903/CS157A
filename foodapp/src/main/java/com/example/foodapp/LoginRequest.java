package com.example.foodapp;

public class LoginRequest {

    private String username;
    private String password;

    public String getUsername() {
        return this.username;
    }
    
    public String getPassword() {
        return this.password;
    }

    public void setUsername(String user) {
        this.username = user;
    }
    
    public void setPassword(String pass) {
        this.password = pass;
    }
}
