CREATE TABLE IF NOT EXISTS [difficulty] (
[pkDifficulty] INTEGER PRIMARY KEY,
[scoreMultiplier] DECIMAL NULL,
[name] VARCHAR NULL,
[triviaApiKey] VARCHAR NULL
);

INSERT INTO difficulty (
    [scoreMultiplier],
    [name],
    [triviaApiKey]
) VALUES
(1.0,'Easy','easy'),
(1.5,'Medium','medium'),
(3.0,'Hard','hard');