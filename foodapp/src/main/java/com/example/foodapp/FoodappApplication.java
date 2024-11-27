package com.example.foodapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.RestController;

import com.example.foodapp.payloads.AuthRequest;

import jakarta.servlet.http.HttpServletRequest;

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

	static String JDBC_URL = "jdbc:postgresql://localhost:5432/food";
	static String USERNAME = "postgres";
	static String PASSWORD = "admin";

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
	public ResponseEntity<?> login(@RequestBody AuthRequest loginRequest, HttpServletRequest request) {
		System.out.println(request.getSession().getId());
		try {
			SecurityContext securityContext = SecurityContextHolder.getContext();

			securityContext.setAuthentication(this.authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
					loginRequest.getUsername(),
					loginRequest.getPassword()
				)
			));

			request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
			return ResponseEntity.ok("Successfully Authenticated");
		}
		catch (Exception e) {
			return ResponseEntity.status(403).body("Something went wrong. Authentication Failed.");

		}
	}

	@PostMapping("/api/auth/register")
	public ResponseEntity<?> register(@RequestBody AuthRequest registeRequest) {
		try {
			Class.forName("org.postgresql.Driver");
			Connection conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);

			String insertNewUserQuery = "INSERT INTO users (user_id, username, password, enabled) " + 
				"VALUES (DEFAULT, ?, ?, true)";

			PreparedStatement ps = conn.prepareStatement(insertNewUserQuery);

			ps.setString(1, registeRequest.getUsername());
			ps.setString(2, registeRequest.getPassword());

			ps.execute();

			ps.close();
			conn.close();

			return ResponseEntity.ok("User successfully created!");

		} catch (ClassNotFoundException e) {
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);
		} catch (SQLException e) {
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);
		}

		return ResponseEntity.status(409).body("User with same username already exists");
	}

	@PostMapping("/api/auth/logout")
	public ResponseEntity<?> logout(HttpServletRequest request) {
		if (request.getSession().getId() != null) {
			request.getSession().invalidate();

			SecurityContextHolder.clearContext();

			return ResponseEntity.ok("Successfully Logged out.");
		}
		return ResponseEntity.ok("No session to logout from.");
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
	public ResponseEntity<?> getAllMeals() {

		try {
			System.out.println(JDBC_URL);
			Connection conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
			/*
			Statement stmt = conn.createStatement();
 
			String CreatePersonTable = "CREATE TABLE Person ( id INTEGER PRIMARY KEY, name VARCHAR(255))";
			stmt.executeQuery(CreatePersonTable);

			stmt.close();
			*/
			conn.close();

		} catch (SQLException e) {
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);
		} catch (Exception e) {
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);
		}
		return ResponseEntity.ok("meals");
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
