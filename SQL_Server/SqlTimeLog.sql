USE Historian;
GO
/*
CREATE SEQUENCE SeqTimeLogIDs AS INT
MINVALUE 1
NO CYCLE;
*/
/*
CREATE TABLE TimeLog(
    ID      INT     NOT NULL CONSTRAINT DFT_TimeLog_ID DEFAULT(NEXT VALUE FOR SeqTimeLogIDs),
    CONSTRAINT PK_TimeLog PRIMARY KEY(ID),
    val     FLOAT   NOT NULL CONSTRAINT DFT_Time_val DEFAULT(0.0),
    dt      DATETIME    NOT NULL CONSTRAINT DFT_TimeLog_comment DEFAULT(SYSDATETIME()),
    comment NVARCHAR(100) NULL
);
*/
/* 注意中文字符串前面要加上N
INSERT INTO TimeLog(val, comment)
VALUES
(7.17, N'这是测试行');
*/
--SELECT * FROM TimeLog;
/*
CREATE PROCEDURE dbo.storeProc
@input_val AS FLOAT,
@input_cmt AS NVARCHAR(100)
AS
BEGIN
    INSERT INTO dbo.TimeLog(val, comment)
    VALUES
    (@input_val, @input_cmt)
END
*/
/*
EXEC dbo.storeProc
@input_val=1987,
@input_cmt=N'这是用存储过程插入的测试行';
SELECT * FROM dbo.TimeLog;
*/