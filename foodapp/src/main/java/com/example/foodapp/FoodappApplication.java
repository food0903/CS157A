package com.example.foodapp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RestController;

import java.sql.*;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@SpringBootApplication
@RestController
public class FoodappApplication {

	@Value("${spring.datasource.url}")
	static String JDBC_URL;
	@Value("${spring.datasource.username}")
	static String USERNAME;
	@Value("${spring.datasource.password}")
	static String PASSWORD;

	private final AuthenticationManager authenticationManager;

	public FoodappApplication(AuthenticationManager authenticationManager) {
		this.authenticationManager = authenticationManager;
	}

	public static void main(String[] args) {
		SpringApplication.run(FoodappApplication.class, args);
	}

	/**
	 * /api/auth endpoints
	 * 
	 * 
	 */

	
	@PostMapping("/api/auth/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request) {
		try {
			this.authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
					request.getUsername(),
					request.getPassword()
				)
			);

			return ResponseEntity.ok("Successfully Authenticated");
		}
		catch (Exception e) {
			return ResponseEntity.status(403).body("Something went wrong. Authentication Failed.");

		}
	}

	@PostMapping("/api/auth/register")
	public String register() {
		return "TODO";
	}

	@PostMapping("/api/auth/logout")
	public String logout() {
		return "TODO";
	}

	@GetMapping("/api/hello")
	public String getMethodName() {
		try {
			Class.forName("org.postgresql.Driver");
			Connection conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
			Statement stmt = conn.createStatement();
 
			String CreateTable = "CREATE TABLE Person ( id INTEGER PRIMARY KEY, name VARCHAR(255))";
			stmt.executeQuery(CreateTable);

			stmt.close();
			conn.close();

		} catch (ClassNotFoundException e) {
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);
		} catch (SQLException e) {
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);
		}

		return new String("Hello World");
	}

	/**
	 * /api/meals endpoints
	 * 
	 * 
	 */

	@GetMapping("/api/meals")
	public String getAllMeals() {
		return "TODO";
	}
	
	@GetMapping("/api/meals/{mealId}")
	public String getMealById(@PathVariable Integer mealId) {
		return new String();
	}

	@PostMapping("/api/meals/{mealId}")
	public String addMealById(@PathVariable Integer mealId) {
		return new String();
	}

	@PutMapping("/api/meals/{mealId}")
	public String updateMealById(@PathVariable Integer mealId) {
		return new String();
	}

	@DeleteMapping("/api/meals/{mealId}")
	public String deleteMealById(@PathVariable Integer mealId) {
		return new String();
	}

	/**
	 * /api/foods endpoints
	 * 
	 * 
	 */

	@GetMapping("/api/foods")
	public String getAllFoods() {
		return new String();
	}
	
	@GetMapping("/api/foods/{foodId}")
	public String getFoodById(@PathVariable Integer foodId) {
		return new String();
	}

	@PostMapping("/api/foods/{foodId}")
	public String addFoodById(@PathVariable Integer foodId) {
		return new String();
	}

	@PutMapping("/api/foods/{foodId}")
	public String updateFoodById(@PathVariable Integer foodId) {
		return new String();
	}

	@DeleteMapping("/api/foods/{foodId}")
	public String deleteFoodById(@PathVariable Integer foodId) {
		return new String();
	}
	
	/**
	 * /api/ingredients endpoints
	 * 
	 * 
	 */

	@GetMapping("/api/ingredients")
	public String getAllIngredients() {
		return new String();
	}
	
	@GetMapping("/api/ingredients/{ingredientId}")
	public String getIngredientById(@PathVariable Integer ingredientId) {
		return new String();
	}

	@PostMapping("/api/ingredients/{ingredientId}")
	public String addIngredientById(@PathVariable Integer ingredientId) {
		return new String();
	}

	@PutMapping("/api/ingredients/{ingredientId}")
	public String updateIngredientById(@PathVariable Integer ingredientId) {
		return new String();
	}

	@DeleteMapping("/api/ingredients/{ingredientId}")
	public String deleteIngredientById(@PathVariable Integer ingredientId) {
		return new String();
	}

	@GetMapping("/api/analysis/weekly")
	public String getWeeklyAnalysis() {
		return "TODO";
	}

	@GetMapping("/api/analysis/daily")
	public String getDailyAnalysis() {
		return "TODO";
	}
	
	@Bean
	public PasswordEncoder getPasswordEncoder() {
		return NoOpPasswordEncoder.getInstance();
	}
}
