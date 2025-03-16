create database db_login
go
--DBCC CHECKIDENT('users' , RESEED, 0)
use db_login
go
create table users(
	id int primary key identity,
	name varchar(25),
	lastname varchar(50),
	username varchar(25),
	email varchar(50),
	password varchar(32),
	image varchar(max) null,
	id_provider varchar(250) null,
	active bit null
)
go
create proc sp_insert_user
(@name varchar(25), @lastname varchar(50), @username varchar(50), @email varchar(50), @password varchar(32), @id_provider varchar(250), @image varchar(max))
as
	if exists (select username from users where username = @username) begin
		RETURN -1;
	end
	else if exists (select email from users where email = @email) begin
		RETURN -2;
	end
	else begin
		insert into users (name, lastname, username, email, password, image, id_provider, active) values
		(@name, @lastname, @username, @email, @password, @image, @id_provider, 1);
		RETURN 1;
	end
go
create proc sp_update_user
(@id int, @name varchar(25), @lastname varchar(50), @username varchar(50), @email varchar(50), @password varchar(32), @id_provider varchar(250), @image varchar(max))
as
	if not exists (select * from users where id = @id) begin
		PRINT 'This user not exists'
		RETURN;
	end

	update users set 
	name = @name, lastname = @lastname,
	username = @username, email = @email, password = @password, image = @image, id_provider = @id_provider;
go
create proc sp_delete_user
(@id int)
as
	if not exists (select * from users where id = @id) begin
		print 'This user not exists'
		return;
	end

	update users set active = 0;
go
create proc sp_user_by_credentials
(@username varchar(50), @password varchar(32))
as
	select id, name, lastname, username, email, password, image, id_provider
	from users u 
	where username = @username
	and password = @password
	and active = 1
go
create proc sp_user_by_id
(@id varchar(250))
as
	select id, name, lastname, username, email, password, image, id_provider
	from users
	where id = CAST(@id as bigint)
	or id_provider = @id
	and active = 1
go
create proc sp_user_by_username
(@username varchar(50))
as
	select id, name, lastname, username, email, password, image, id_provider
	from users
	where username = @username
	and active = 1
go

select * from users
delete from users