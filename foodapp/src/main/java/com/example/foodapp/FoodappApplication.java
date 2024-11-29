package com.example.foodapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.RestController;

import com.example.foodapp.payloads.*;

import jakarta.servlet.http.HttpServletRequest;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

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
			Connection conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);

			// prepare query to get user_id
			PreparedStatement ps = conn.prepareStatement("SELECT user_id FROM users WHERE username = ?");
			ps.setString(1, loginRequest.getUsername());

			// execute the query
			ResultSet rs = ps.executeQuery();

			// move cursor to first and only row
			rs.next();

			request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);
			request.getSession().setAttribute("username", loginRequest.getUsername());
			request.getSession().setAttribute("user_id", rs.getString("user_id"));

			return ResponseEntity.ok("Successfully Authenticated");
		}
		catch (Exception e) {
			System.out.println(e);
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

	/**
	 * /api/meals endpoints
	 * 
	 * 
	 */

	@GetMapping("/api/meals")
	public ResponseEntity<?> getAllMeals(HttpServletRequest request) {

		Connection conn = null;
		boolean noFailures = true;
		ArrayList<MealsResponse> meals = new ArrayList<>();

		try {
			conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);

			/*
			 * Get all meals with user_id equal to current user
			 */

			// prepare statement to get all meals of current user
			String query = "SELECT * FROM meals WHERE user_id = ?";
			PreparedStatement ps = conn.prepareStatement(query);

			// set user_id and execute the query
			ps.setInt(1, Integer.parseInt((String) request.getSession().getAttribute("user_id")));
			ResultSet rs = ps.executeQuery();


			// iterate through ResultSet and append all meals to array
			while (rs.next()) {
				MealsResponse temp = new MealsResponse();
				temp.setMealId(rs.getInt("meal_id"));
				temp.setMealName(rs.getString("meal_name"));
				temp.setDate(rs.getString("date"));
				temp.setMealType(rs.getString("meal_type"));

				// get all food_id's and quantities for this meal
				ArrayList<Map<Integer, Integer>> foodIds = new ArrayList<>();
				String getFoodIdsQuery = "SELECT food_id, quantity FROM meal_foods WHERE meal_id = ?";
				PreparedStatement ps2 = conn.prepareStatement(getFoodIdsQuery);

				ps2.setInt(1, rs.getInt("meal_id"));
				ResultSet rs2 = ps2.executeQuery();

				// add values to response body			
				while (rs2.next()) {
					foodIds.add(Map.of(rs2.getInt("food_id"), rs2.getInt("quantity")));
				}

				rs2.close();
				ps2.close();

				temp.setFoodIds(foodIds);

				meals.add(temp);
			}

			rs.close();
			ps.close();

		} catch (SQLException e) {
			noFailures = false;
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);
		} finally {
			// attempt to close connection if it is not null
			if (conn != null) {
				try {
					conn.close();
	 			} catch (SQLException e) {
					System.err.println("Failed to close connection");	
					System.err.println(e.getMessage());
				}
			}
		}

		if (noFailures) {
			// return the meals to user
			return ResponseEntity.ok(meals);
		}
		return ResponseEntity.status(400).body("bad request");
	}
	
	@GetMapping("/api/meals/{mealId}")
	public ResponseEntity<?> getMealById(@PathVariable Integer mealId, HttpServletRequest request) {
		Connection conn = null;
		boolean noFailures = true;
		MealsResponse meal = null;

		try {
			conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);

			/*
			 * Get all meals with user_id equal to current user
			 */

			// prepare statement to get all meals of current user
			String query = "SELECT * FROM meals WHERE user_id = ? AND meal_id = ?";
			PreparedStatement ps = conn.prepareStatement(query);

			// set user_id and execute the query
			ps.setInt(1, Integer.parseInt((String) request.getSession().getAttribute("user_id")));
			ps.setInt(2, mealId);

			ResultSet rs = ps.executeQuery();

			// iterate through all rows from SELECT and append all columns to response body
			if (rs.next()) {
				meal = new MealsResponse();
				meal.setMealId(rs.getInt("meal_id"));
				meal.setMealName(rs.getString("meal_name"));
				meal.setDate(rs.getString("date"));
				meal.setMealType(rs.getString("meal_type"));

				// query to get the quantity of each food in the meal
				ArrayList<Map<Integer, Integer>> foodIds = new ArrayList<>();
				String getFoodIdsQuery = "SELECT food_id, quantity FROM meal_foods WHERE meal_id = ?";
				PreparedStatement ps2 = conn.prepareStatement(getFoodIdsQuery);
				ps2.setInt(1, mealId);

				// store food_id and corresponding quantity in response body
				ResultSet rs2 = ps2.executeQuery();
				while (rs2.next()) {
					foodIds.add(Map.of(rs2.getInt("food_id"), rs2.getInt("quantity")));
				}

				rs2.close();
				ps2.close();

				meal.setFoodIds(foodIds);
			}

			rs.close();
			ps.close();

		} catch (SQLException e) {
			noFailures = false;
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);
		} finally {
			// attempt to close connection if it is not null
			if (conn != null) {
				try {
					conn.close();
	 			} catch (SQLException e) {
					System.err.println("Failed to close connection");	
					System.err.println(e.getMessage());
				}
			}
		}
		if (meal == null) {
			return ResponseEntity.status(400).body("No meal with meal_id " + mealId);
		}

		if (noFailures) {
			// return the meals to user
			return ResponseEntity.ok(meal);
		}
		return ResponseEntity.status(400).body("bad request");
	}

	@PostMapping("/api/meals")
	public ResponseEntity<?> addMealById(@RequestBody MealsRequest mealsRequest, HttpServletRequest request) {

		// check if meal is linked to at least 1 food
		if (mealsRequest.getFoodIds().size() < 1) {
			return ResponseEntity.status(400).body("foodIds must be a non-empty list!");
		}

		Connection conn = null;
		boolean noFailures = true;
		Integer meal_id = null;

		try {
			
			conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
			conn.setAutoCommit(false);

			/*
			 * 1. Create meal in meals table
			 * 2. Link meal to all assossiated foods in meal_foods table
			 */
			
			// 1.
			// create the prepared statement for inserting into meals
			String query = "INSERT INTO meals (meal_id, user_id, meal_name, date, meal_type) " +
				"VALUES (DEFAULT, ?, ?, ?, ?)";
			PreparedStatement ps = conn.prepareStatement(query, Statement.RETURN_GENERATED_KEYS);

			// insert values into prepared statement
			ps.setInt(1, Integer.parseInt((String) request.getSession().getAttribute("user_id")));
			ps.setString(2, mealsRequest.getMealName());
			ps.setDate(3, mealsRequest.getDate());
			ps.setString(4, mealsRequest.getMealType());

			// execute the query
			ps.executeUpdate();

			// get meal_id of newly inserted row
			ResultSet rs = ps.getGeneratedKeys();
			if (!rs.next()) {
				return ResponseEntity.status(500).body("Could not get meal_id of newly inserted column");
			}
			meal_id = rs.getInt(1);

			// cleanup
			rs.close();
			ps.close();

			// 2.
			query = "INSERT INTO meal_foods (meal_food_id, meal_id, food_id, quantity) " + 
				"VALUES (DEFAULT, ?, ?, ?)";
			ps = conn.prepareStatement(query);

			Map<Integer, Integer> foodIds = mealsRequest.getFoodIds();
			Iterator<Integer> keys = foodIds.keySet().iterator();

			while (keys.hasNext()) {
				Integer foodId = keys.next();
				ps.setInt(1, meal_id);
				ps.setInt(2, foodId);
				ps.setInt(3, foodIds.get(foodId));
				ps.execute();
			}

			// close and commit
			ps.close();
			conn.commit();

		} catch (SQLException e) {
			noFailures = false;
			System.err.println(e.getMessage());
			e.printStackTrace(System.out);

			// attempt to rollback if connection is not null
			if (conn != null) {
				try {
					System.out.println("Attempting to rollback transaction.");
					conn.rollback();
				} catch (SQLException se) {
					System.err.println("Failed to rollback.");
					System.err.println(se.getMessage());
				}
			}
		} finally {
			// attempt to close connection if it is not null
			if (conn != null) {
				try {
					conn.close();
	 			} catch (SQLException e) {
					System.err.println("Failed to close connection");	
					System.err.println(e.getMessage());
				}
			}
		}

		if (noFailures) {
			HashMap<String, String> res_body = new HashMap<>();
			res_body.put("mealId", meal_id.toString());
			res_body.put("body", "Successfully added a new meal!");
			return ResponseEntity.ok(res_body);
		}
		return ResponseEntity.status(400).body("bad request");
	}

	@PutMapping("/api/meals/{mealId}")
	public ResponseEntity<?> updateMealById(@PathVariable Integer mealId, @RequestBody MealsRequest mealsRequest, HttpServletRequest request) {
		// check if meal is linked to at least 1 food
		if (mealsRequest.getFoodIds().size() < 1) {
			return ResponseEntity.status(400).body("foodIds must be a non-empty list!");
		}

		Connection conn = null;
		boolean noFailures = true;

		try {
			
			conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
			conn.setAutoCommit(false);

			/*
			 * 1. Update meal in meals table with meal_id
			 * 2. Update meal_foods
			 */
			
			// 1.
			// create the prepared statement for inserting into meals
			String query = "UPDATE meals " + 
				"SET meal_name = ?, date = ?, meal_type = ? " +
				"WHERE meal_id = ?";
			PreparedStatement ps = conn.prepareStatement(query);

			// insert values into prepared statement
			ps.setString(1, mealsRequest.getMealName());
			ps.setDate(2, mealsRequest.getDate());
			ps.setString(3, mealsRequest.getMealType());
			ps.setInt(4, mealId);

			// execute the query
			ps.executeUpdate();

			// cleanup
			ps.close();

			// 2.
			// DELETE all rows from meal_foods with meal_id
			String deleteSql = "DELETE FROM meal_foods WHERE meal_id = ?";
			PreparedStatement deleteStmt = conn.prepareStatement(deleteSql);

			// execute DELETE and close
			deleteStmt.setInt(1, mealId);
			deleteStmt.executeUpdate();
			deleteStmt.close();


			// re-INSERT all rows with new updated values
			query = "INSERT INTO meal_foods (meal_food_id, meal_id, food_id, quantity) " + 
				"VALUES (DEFAULT, ?, ?, ?)";
			ps = conn.prepareStatement(query);

			Map<Integer, Integer> foodIds = mealsRequest.getFoodIds();
			Iterator<Integer> keys = foodIds.keySet().iterator();

			while (keys.hasNext()) {
				Integer foodId = keys.next();
				ps.setInt(1, mealId);
				ps.setInt(2, foodId);
				ps.setInt(3, foodIds.get(foodId));
				ps.execute();
			}

			// close and commit
			ps.close();
			conn.commit();

		} catch (SQLException e) {
			noFailures = false;
			System.err.println(e.getMessage());
			e.printStackTrace(System.out);

			// attempt to rollback if connection is not null
			if (conn != null) {
				try {
					System.out.println("Attempting to rollback transaction.");
					conn.rollback();
				} catch (SQLException se) {
					System.err.println("Failed to rollback.");
					System.err.println(se.getMessage());
				}
			}
		} finally {
			// attempt to close connection if it is not null
			if (conn != null) {
				try {
					conn.close();
	 			} catch (SQLException e) {
					System.err.println("Failed to close connection");	
					System.err.println(e.getMessage());
				}
			}
		}

		if (noFailures) {
			return ResponseEntity.ok("Successfully updated meal!");
		}
		return ResponseEntity.status(400).body("bad request");
	}

	@DeleteMapping("/api/meals/{mealId}")
	public ResponseEntity<?> deleteMealById(@PathVariable Integer mealId, HttpServletRequest request) {

		Connection conn = null;
		boolean noFailures = true;

		try {
			
			conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
			conn.setAutoCommit(false);

			/*
			 * Delete all rows with meal_id in meals (deletions will be cascaded to meal_foods table)
			 */
			
			// create the prepared statement for inserting into meals
			String query = "DELETE FROM meals WHERE user_id = ? AND meal_id = ?";
			PreparedStatement ps = conn.prepareStatement(query);

			ps.setInt(1, Integer.parseInt((String) request.getSession().getAttribute("user_id")));
			ps.setInt(2, mealId);

			// execute the query
			ps.execute();

			// cleanup
			ps.close();

			// commit and close connection
			conn.commit();

		} catch (SQLException e) {
			noFailures = false;
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);

			// attempt to rollback if connection is not null
			if (conn != null) {
				try {
					System.out.println("Attempting to rollback transaction.");
					conn.rollback();
				} catch (SQLException se) {
					System.err.println("Failed to rollback.");
					System.err.println(se.getMessage());
				}
			}
		} finally {
			// attempt to close connection if not null
			if (conn != null) {
				try {
					conn.close();
	 			} catch (SQLException e) {
					System.err.println("Failed to close connection");	
					System.err.println(e.getMessage());
				}
			}
		}

		if (noFailures) {
			return ResponseEntity.ok("Succesfully Deleted Meal!");
		}
		return ResponseEntity.status(400).body("bad request");
	}

	/**
	 * /api/foods endpoints
	 * 
	 * 
	 */

	@GetMapping("/api/foods")
	public String getAllFoods(HttpServletRequest request) {
		return (String) request.getSession().getAttribute("username");
	}
	
	@GetMapping("/api/foods/{foodId}")
	public String getFoodById(@PathVariable Integer foodId) {
		return new String();
	}

	/*
	 * Request Body must include these fields:
	 * 	- foodName (String)
	 * 	- calories (Integer)
	 * 	- carbs (Integer)
	 * 	- fats (Integer)
	 * 	- protein (Integer)
	 */
	@PostMapping("/api/foods")
	public ResponseEntity<?> addFoodById(@RequestBody FoodsRequest foodRequest, HttpServletRequest request) {

		Connection conn = null;
		boolean noFailures = true;

		try {
			
			conn = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
			conn.setAutoCommit(false);

			/*
			 * Add new row to food table;
			 */
			
			// 1.
			// create the prepared statement for inserting into meals
			String query = "INSERT INTO foods (food_id, user_id, food_name, calories, carbs, fats, protein) " +
				"VALUES (DEFAULT, ?, ?, ?, ?, ?, ?)";
			PreparedStatement ps = conn.prepareStatement(query);

			// insert values into prepared statement
			ps.setInt(1, Integer.parseInt((String) request.getSession().getAttribute("user_id")));
			ps.setString(2, foodRequest.getFoodName());
			ps.setInt(3, foodRequest.getCalories());
			ps.setInt(4, foodRequest.getCarbs());
			ps.setInt(5, foodRequest.getFats());
			ps.setInt(6, foodRequest.getProtein());

			// execute the query
			ps.execute();

			// close and commit
			ps.close();
			conn.commit();

		} catch (SQLException e) {
			noFailures = false;
			System.out.println(e.getMessage());
			e.printStackTrace(System.out);

			// attempt to rollback if connection is not null
			if (conn != null) {
				try {
					System.out.println("Attempting to rollback transaction.");
					conn.rollback();
				} catch (SQLException se) {
					System.err.println("Failed to rollback.");
					System.err.println(se.getMessage());
				}
			}
		} finally {
			// attempt to close connection if it is not null
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					System.err.println("Failed to close connection");
					System.err.println(e.getMessage());
				}
			}
		}

		if (noFailures) {
			return ResponseEntity.ok("Successfully added food!");
		}
		return ResponseEntity.status(400).body("bad request");
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
