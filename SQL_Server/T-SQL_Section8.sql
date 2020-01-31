USE TSQL2012;
GO
/*
IF OBJECT_ID('dbo.Orders','U') IS NOT NULL DROP TABLE dbo.Orders
CREATE TABLE dbo.Orders
(
    orderid     INT     NOT NULL CONSTRAINT PK_Orders PRIMARY KEY,
    orderdate   DATE    NOT NULL CONSTRAINT DFT_ordatedate DEFAULT(SYSDATETIME()),
    empid       INT     NOT NULL,
    custid      VARCHAR(10) NOT NULL
);
GO
INSERT INTO dbo.Orders(orderid, orderdate, empid, custid)
VALUES(1001, '20090212', 3, 'A');

INSERT INTO dbo.Orders(orderid, orderdate, empid, custid)
VALUES
(10003,'20090213',4,'B'),
(10004,'20090214',1,'A'),
(10005,'20090213',1,'C'),
(10006,'20090215',3,'C');

UPDATE dbo.Orders
SET orderid=10001
WHERE orderid=1001;
*/
/*
select * from
(
    VALUES
        (10003,'20090213',4,'A'),
        (10004,'20090214',1,'B')
) AS O(orderid,orderdate,empid,custid);
*/
/*
INSERT INTO dbo.Orders(orderid,orderdate,empid,custid)
SELECT orderid,orderdate,empid,custid
FROM Sales.Orders
WHERE shipcountry = 'UK';
*/
/*
IF OBJECT_ID('Sales.usp_getorders','P')IS NOT NULL
    DROP PROC Sales.usp_getorders;
GO
CREATE PROC Sales.usp_getorders
    @country AS NVARCHAR(40)
    AS
    SELECT orderid,orderdate,empid,custid
    FROM Sales.Orders
    WHERE shipcountry=@country;
GO
*/
--EXEC Sales.usp_getorders @country='France'
/*
INSERT INTO dbo.Orders(orderid,orderdate,empid,custid)
EXEC Sales.usp_getorders @country='France'
*/
/*
CREATE TABLE dbo.T1 
(
    keycol      INT     NOT NULL IDENTITY(1,1)
        CONSTRAINT PK_T1 PRIMARY KEY,
    datacol     VARCHAR(10)     NOT NULL
        CONSTRAINT CHK_T1_datacol CHECK(datacol LIKE '[A-Za-z]%')
);
INSERT INTO dbo.T1(datacol)
VALUES
('AAAAA'),
('CCCCC'),
('BBBBB');
*/
--SELECT $identity FROM dbo.T1
/*
INSERT INTO dbo.T1(datacol)
VALUES
('AAAAA');
DECLARE @new_key AS INT;
SET @new_key = IDENT_CURRENT('dbo.T1');
SELECT @new_key AS new_key;
*/
/*
INSERT INTO dbo.T1(datacol) 
OUTPUT
    inserted.keycol AS keycol,
    inserted.datacol AS datacol
VALUES('EEEEE');
*/
/*
SET IDENTITY_INSERT dbo.T1 ON;
INSERT INTO dbo.T1(keycol,datacol) VALUES (5,'FFFFF');
SET IDENTITY_INSERT dbo.T1 OFF;

INSERT INTO dbo.T1(datacol) VALUES ('GGGGG');
SELECT * FROM dbo.T1;
*/
/*
CREATE SEQUENCE dbo.seqOrderIDs AS INT
    MINVALUE 1
    CYCLE;

ALTER SEQUENCE dbo.seqOrderIDs
    NO CYCLE;
*/
--SELECT NEXT VALUE FOR dbo.seqOrderIDs AS IDs ;
/*IF OBJECT_ID('dbo.T1','U') IS NOT NULL DROP TABLE dbo.T1;
CREATE TABLE dbo.T1 
(
    keycol      INT     NOT NULL CONSTRAINT PK_T1 PRIMARY KEY,
    datacol     VARCHAR(10)
);
*/
--DECLARE @new_id AS INT = NEXT VALUE FOR dbo.seqOrderIDs;
/*INSERT INTO dbo.T1(keycol, datacol)
OUTPUT
    inserted.keycol AS keycol,
    inserted.datacol AS datacol
VALUES
(NEXT VALUE FOR dbo.seqOrderIDs,'b');
*/
---------------------------------------------
/*
SELECT current_value, OBJECT_ID
FROM sys.sequences
*/
---------------------------------------------
/*
INSERT INTO dbo.T1(keycol, datacol)
SELECT NEXT VALUE FOR  dbo.seqOrderIDs OVER(ORDER BY hiredate),
    LEFT(firstname, 1) + LEFT(lastname, 1)
FROM HR.Employees;
SELECT * FROM dbo.T1;
*/
/*
ALTER TABLE dbo.T1 
    ADD CONSTRAINT DFT_T1_keycol DEFAULT(NEXT VALUE FOR dbo.seqOrderIDs)
    FOR keycol;
*/
--DROP TABLE dbo.Customers;
/*
CREATE TABLE dbo.Customers
(
    custid      INT     NOT NULL PRIMARY KEY,
    companyname NVARCHAR(40)    NOT NULL,
    country     NVARCHAR(15)    NOT NULL,
    region      NVARCHAR(15)    NULL,
    city        NVARCHAR(15)    NOT NULL 
);
*/
/*
INSERT INTO dbo.Customers(custid, companyname, country, region,city)
VALUES
(100,'Coho Winery','USA','WA','Redmond');
*/
/*
INSERT INTO dbo.Customers(custid,companyname,country,region,city)
SELECT custid, companyname, country, region, city
FROM Sales.Customers AS C
WHERE EXISTS(
    SELECT *
    FROM Sales.Orders AS O
    WHERE C.custid=O.custid
);
*/
/*
IF OBJECT_ID('dbo.Orders','U') IS NOT NULL DROP TABLE dbo.Orders;

SELECT *
INTO dbo.Orders
FROM Sales.Orders
WHERE orderdate >= '20060101' AND orderdate < '20090101';
*/
/*
DELETE FROM dbo.Orders
OUTPUT 
deleted.orderid AS orderid,
deleted.orderdate AS orderdate
WHERE orderdate < '20060801'
*/
/*
DELETE FROM dbo.Orders
OUTPUT
deleted.orderid AS orderid
WHERE EXISTS(
    SELECT * FROM Sales.Customers AS C
    WHERE C.custid=dbo.Orders.custid
    AND C.country='Brazil'
)
*/
/*
WITH TBL
AS 
(
    SELECT O.custid AS custid
    FROM dbo.Orders AS O
    JOIN Sales.Customers AS C
    ON O.custid=C.custid
    WHERE C.country='Brazil'
)
UPDATE TBL
SET custid=custid;
*/
/*
MERGE dbo.Orders AS TGT 
USING Sales.Customers AS SRC 
ON TGT.custid=SRC.custid
WHEN MATCHED AND SRC.country='Brazil' THEN
DELETE;
*/
/*
UPDATE dbo.Customers
SET region = '<None>'
OUTPUT
inserted.custid,
deleted.region AS oldregion,
inserted.region AS newregion
WHERE region IS NULL
*/
--SELECT * FROM dbo.Orders;
MERGE dbo.Orders AS O
USING dbo.Customers AS C
ON C.custid=O.custid
AND C.country='UK'
WHEN MATCHED THEN
UPDATE
SET O.shipcountry=C.country,
    O.shipregion=C.region,
    O.shipcity=C.city;