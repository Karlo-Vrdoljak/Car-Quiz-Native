CREATE TABLE IF NOT EXISTS [config] (
[pkConfig] INTEGER PRIMARY KEY,
[minQuestions] INT NULL,
[maxQuestions] INT NULL,
[timeLimit] INT NULL
);

INSERT INTO config 
(
    [minQuestions],
    [maxQuestions],
    [timeLimit],
)
VALUES
(10,50,900000);