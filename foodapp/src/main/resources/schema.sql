create table users(
	username varchar(50) not null primary key,
	password varchar(500) not null,
	enabled boolean not null
);

CREATE TABLE authorities (
    username VARCHAR(50) NOT NULL,
    authority VARCHAR(50) NOT NULL,
    CONSTRAINT fk_username FOREIGN KEY(username) REFERENCES users(username)
);