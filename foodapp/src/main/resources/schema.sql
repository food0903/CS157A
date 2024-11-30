create table users(
    user_id serial primary key,
	username varchar(50) unique not null,
	password varchar(500) not null,
	enabled boolean not null
);

CREATE TABLE authorities (
    username VARCHAR(50) NOT NULL,
    authority VARCHAR(50) NOT NULL,
    CONSTRAINT fk_username FOREIGN KEY(username) REFERENCES users(username)
);

CREATE TABLE meals (
	meal_id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
	meal_name VARCHAR(500),
	date DATE NOT NULL,
	meal_type VARCHAR(20)
);

CREATE TABLE foods (
	food_id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
	food_name VARCHAR(500) NOT NULL,
	calories INTEGER NOT NULL,
	carbs INTEGER NOT NULL,
	fats INTEGER NOT NULL,
	protein INTEGER NOT NULL
);

CREATE TABLE meal_foods (
	meal_food_id SERIAL PRIMARY KEY,
	meal_id INTEGER REFERENCES meals(meal_id) ON DELETE CASCADE,
	food_id INTEGER REFERENCES foods(food_id) ON DELETE CASCADE,
	quantity INTEGER NOT NULL
);
