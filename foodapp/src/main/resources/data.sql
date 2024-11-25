insert into users (user_id, username, password, enabled)
values (DEFAULT, 'user', 'pass', true);

insert into authorities (username, authority)
values ('user', 'temp');

insert into users (user_id, username, password, enabled)
values (DEFAULT, 'user2', 'pass2', true);

insert into authorities (username, authority)
values ('user2', 'temp');