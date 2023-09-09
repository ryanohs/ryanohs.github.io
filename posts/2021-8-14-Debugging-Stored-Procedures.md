---
layout: post
title: Debugging Stored Procedures
---

See the demo [here](https://ryanohs.github.io/demos/Transform.html).

A project I work on has a very large number of stored procedures which contain most of the business logic. Debugging this application is difficult. The debug process we have is to copy the body of a stored procedure, create variables for every parameter, set them to values known from run time, and then executing the script in SSMS. You can hack this together by copying the procedure body from source code and using SSMS to generate an execution script for the procedure, and then gluing those together in a new script. But this is tedious.

I created a simple website that generates the resulting script for you. After pasting in a stored procedure definition, it generates a script that you can run for debugging. Many of our procedures have common parameters that we can supply default values for when debugging so this website also substitutes the default values.

Example input:

    lang: sql
	CREATE PROCEDURE SelectAllCustomers @City nvarchar(30), @PostalCode nvarchar(10)
	AS
	BEGIN
	SELECT * FROM Customers WHERE City = @City AND PostalCode = @PostalCode
	END

Generates this script:

    lang: sql
	-- SelectAllCustomers

	DECLARE @City nvarchar(30) = NULL
	DECLARE @PostalCode nvarchar(10) = NULL

	SELECT * FROM Customers WHERE City = @City AND PostalCode = @PostalCode

I made a few assumptions:
- The procedure will have parameters. It can handle multiline and single line parameter lists. Output parameters are included in the generated scripts.
- The procedure name can contain schema identifiers, brackets, and underscores.
- The procedure body must be surrounded by BEGIN … END statements. Our procedures are primarily multiple statements so this is not an issue.
- Any stored procedure options are ignored.

The implementation is essentially two regex statements. The first regex identifies the procedure name, parameters, and body.

	/create\s+procedure\s+([\w\.\[\]_]+)(.*)\sas\s+begin\s(.*)\send/is

The second regex identifies parameters from the parameter block.

	/\s*,*(@\w+)\s+([\w\(\)]+)\s*=?\s*([\w\(\)']+)?/gm

I also replace any occurrence of “OBJECT_NAME(@@PROCID)” with the procedure name as a string since this is commonly used in our procedures.