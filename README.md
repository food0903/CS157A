
## How to Setup and Run the Backend Spring Boot Server

### Prequisites
- Java installed
- Maven installed

1. Create a database in PostgreSQL server
2. Go into `./foodapp/src/main/resources/application.properties` and fill in the following details
```
spring.datasource.url=jdbc:postgresql://<host>:<port>/<db-name>
spring.datasource.username=<username>
spring.datasource.password=<password>
spring.datasource.driver-class-name=org.postgresql.Driver
```

I suggest using `postgres` for username and `admin` for the password for simplicity

3. Go into `./foodapp/src/main/java/com/example/foodapp/FoodappApplication.java` and replace lines 38-40 with the same values as above for the JDBC database connection. 

Please note that there is also a field called `spring.sql.init.mode` in `application.properties` that is commented out. This setting automatically runs `.sql` files located also in the `resources` directory. With this option uncommented, the tables defined in `create_schema.sql` are automatically created and the tables are seeded with the data in `initialize_data.sql` upon initialization of the server. However, if the tables already exist in the PosgreSQL database, then having this option enabled causes the server to crash during initialization. So if the tables already exist in the database, then comment out `spring.sql.init.mode` (or you can delete the tables from the database and then have the server recreate them upon initialization).

Additionally, any changes made to `application.properties` will not be tracked by git because its update-index has been set to --assume-unchanged.

4. To run the backend server, change directories to the `./foodapp` directory then run the following command
```
mvn spring-boot:run
```

5. The backend should be hosted locally on http://localhost:8080


## How to Setup and Run the Frontend
### Prerequisites
- Node.js installed

1. Change directories into the `./frontend` directory

2. Install dependecies using the following command
```
npm install
```

3. Run the frontend using the following command
```
npm run dev
```

4. The frontend should be hosted locally on http://localhost:3000
