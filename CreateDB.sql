
IF  EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[Transactions]') AND type in (N'U'))
  DROP TABLE [dbo].[Transactions]
  GO

IF  EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[TransactionsTypes]') AND type in (N'U'))
  DROP TABLE [dbo].[TransactionsTypes]
  GO

IF  EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[Accounts]') AND type in (N'U'))
  DROP TABLE [dbo].[Accounts]
  GO

IF  EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[Users_Roles]') AND type in (N'U'))
  DROP TABLE [dbo].[Users_Roles]
  GO

IF  EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
  DROP TABLE [dbo].[Users]
  GO

IF  EXISTS (SELECT *
FROM sys.objects
WHERE object_id = OBJECT_ID(N'[dbo].[Roles]') AND type in (N'U'))
  DROP TABLE [dbo].[Roles]
  GO

CREATE TABLE [Users]
(
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [email] nvarchar(255) UNIQUE NOT NULL,
  [identity] nvarchar(255) UNIQUE NOT NULL,
  [password] nvarchar(255),
  [activeRoleId] integer,
  [refresh] nvarchar(255),
  [created_at] datetime DEFAULT getutcdate()
)
  GO

CREATE TABLE [Roles]
(
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [name] nvarchar(255),
  [created_at] datetime DEFAULT getutcdate()
)
  GO

CREATE TABLE [Accounts]
(
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [userId] integer,
  [number] nvarchar(255),
  [created_at] datetime DEFAULT getutcdate()
)
  GO

CREATE TABLE [Transactions]
(
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [originAccountId] integer,
  [destinationAccountId] integer,
  [amount] float,
  [transactionsTypeId] integer,
  [created_at] datetime DEFAULT getutcdate()
)
  GO

CREATE TABLE [TransactionsTypes]
(
  [id] integer PRIMARY KEY IDENTITY(1, 1),
  [Action] nvarchar(255),
  [created_at] datetime DEFAULT getutcdate()
)
  GO

CREATE TABLE [Users_Roles]
(
  [Users_id] integer,
  [Roles_id] integer,
  PRIMARY KEY ([Users_id], [Roles_id])
);
  GO

ALTER TABLE [Users_Roles] ADD FOREIGN KEY ([Users_id]) REFERENCES [Users] ([id]);
  GO

ALTER TABLE [Users_Roles] ADD FOREIGN KEY ([Roles_id]) REFERENCES [Roles] ([id]);
  GO


ALTER TABLE [Users] ADD FOREIGN KEY ([activeRoleId]) REFERENCES [Roles] ([id])
  GO

ALTER TABLE [Accounts] ADD FOREIGN KEY ([userId]) REFERENCES [Users] ([id])
  GO

ALTER TABLE [Transactions] ADD FOREIGN KEY ([originAccountId]) REFERENCES [Accounts] ([id])
  GO

ALTER TABLE [Transactions] ADD FOREIGN KEY ([destinationAccountId]) REFERENCES [Accounts] ([id])
  GO

ALTER TABLE [Transactions] ADD FOREIGN KEY ([transactionsTypeId]) REFERENCES [TransactionsTypes] ([id])
  GO

-- Create UserRole Client with a user is created and update the activeRole
IF EXISTS (SELECT *
FROM sys.triggers
WHERE object_id = OBJECT_ID(N'[dbo].[CreateUserRoleClient]'))
  DROP TRIGGER [dbo].[CreateUserRoleClient]
  GO

CREATE TRIGGER [dbo].[CreateUserRoleClient] ON [dbo].[Users]
  AFTER INSERT
  AS
  BEGIN
  SET NOCOUNT ON;
  DECLARE @UserId int;
  DECLARE @RoleId int;
  SET @UserId = (SELECT id
  FROM inserted);
  SET @RoleId = (SELECT id
  FROM Roles
  WHERE name = 'Client');
  INSERT INTO [dbo].[Users_Roles]
    ([Users_id],[Roles_id])
  VALUES(@UserId, @RoleId);
  UPDATE [dbo].[Users] SET [activeRoleId] = @RoleId WHERE [id] = @UserId;
END
GO
-- before update check if user has role in users_roles table, if not return message
IF EXISTS (SELECT *
FROM sys.triggers
WHERE object_id = OBJECT_ID(N'[dbo].[UpdateUserRole]'))
  DROP TRIGGER [dbo].[UpdateUserRole]
  GO

CREATE TRIGGER [dbo].[UpdateUserRole] ON [dbo].[Users]
  AFTER UPDATE
  AS
  BEGIN
  SET NOCOUNT ON;
  DECLARE @UserId int;
  DECLARE @RoleId int;
  SET @UserId = (SELECT id
  FROM inserted);
  SET @RoleId = (SELECT activeRoleId
  FROM inserted);
  IF NOT EXISTS (SELECT *
  FROM Users_Roles
  WHERE Users_id = @UserId AND Roles_id = @RoleId)
    BEGIN
    RAISERROR ('User does not have role', 16, 1);
    ROLLBACK TRANSACTION;
    RETURN;
  END
END
  GO


DECLARE @AdminEmail varchar(255);
DECLARE @AdminIdentity varchar(255);
DECLARE @AdminPass varchar(255);
SET @AdminEmail = 'Admin@superrito.com';
SET @AdminIdentity = 'Admin';
SET @AdminPass = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';

INSERT INTO [dbo].[Roles]
  ([name])
VALUES
  ('Admin')
INSERT INTO [dbo].[Roles]
  ([name])
VALUES
  ('Employee')
INSERT INTO [dbo].[Roles]
  ([name])
VALUES
  ('Client')
INSERT INTO [dbo].[Users]
  ([email],[identity],[password])
VALUES(@AdminEmail, @AdminIdentity, @AdminPass)
INSERT INTO [dbo].[Users]
  ([email],[identity],[password])
VALUES('Client@superrito.com', 'Client', @AdminPass)
INSERT INTO [dbo].[Users_Roles]
  ([Users_id],[Roles_id])
VALUES((select top(1)
      id
    from users
    where [email] = @AdminEmail), (select top(1)
      id
    from roles
    where name = 'Admin'))
INSERT INTO [dbo].[Users_Roles]
  ([Users_id],[Roles_id])
VALUES((select top(1)
      id
    from users
    where [email] = @AdminEmail), (select top(1)
      id
    from roles
    where name = 'Employee'))
  GO