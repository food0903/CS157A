
## How to Setup and Run

1. Create in PostgreSQL server
2. Go into `src/main/resources/application.properties` and fill in the following details
```
spring.datasource.url=jdbc:postgresql://<host>:<port>/<db-name>
spring.datasource.username=<username>
spring.datasource.password=<password>
spring.datasource.driver-class-name=org.postgresql.Driver

```

I suggest using `postgres` for username and `admin` for the password for simplicity

Please note that there is also a field called "spring.sql.init.mode" in `application.properties` that is commented out. This setting automatically creates the tables defined in `schema.sql` and seeds the database with the values in `data.sql` upon initialization of the server. However, if the tables already exist, then having this option enabled causes the server to crash during initialization (hence why it is commented out).

3. Run the application from `FoodappApplication.java`
4. The backend should be hosted locally on [localhost:8080](localhost:8080)