---
layout: post
title: Is SQLite fast enough?
---

Yes, yes it is.

Based on the bullet journal node structure from my prior post, I wanted to know how long it would take to load the structure if I stored it in SQLite.

I started with [this code](https://www.developersoapbox.com/connecting-to-a-sqlite-database-using-net-core/) to call SQLite via EF Core. Then I added a recursive query based on the SQLite CTE [documentation](https://www.sqlite.org/lang_with.html).

To generate data, I'm using recursion to build a tree with about 10,000 nodes. That works out to about 200 printed pages assuming one node per line. My dataset will be smaller than this.

The result was: it's faster than I expected.

    60 ms
    11,111 records
    222 pages
    
How does it scale?

    3,751 ms
    111,111 records
    2,222 pages

Limitations: I'm only storing the node and parent IDs. I didn't store any node content in the database, but I don't expect that to impact the speed of the look ups to load the tree structure.

The GUID IDs could be converted to binary blobs but at this speed I don't think it's necessary.

I found that adding the index decreased the run time about 33%.

    lang: C#
	[Fact]
	public void Test()
	{
		var connectionStringBuilder = new SqliteConnectionStringBuilder();

		connectionStringBuilder.DataSource = "./SqliteDB.db";

		using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
		{
			connection.Open();

			var delTableCmd = connection.CreateCommand();
			delTableCmd.CommandText = "DROP TABLE IF EXISTS nodes";
			delTableCmd.ExecuteNonQuery();

			var createTableCmd = connection.CreateCommand();
			createTableCmd.CommandText = "CREATE TABLE nodes(id text PRIMARY KEY, name text, parent text null)";
			createTableCmd.ExecuteNonQuery();
			createTableCmd.CommandText = "CREATE INDEX nodes_parent ON nodes(parent);";
			createTableCmd.ExecuteNonQuery();

			var rootId = Guid.NewGuid();

			using (var transaction = connection.BeginTransaction())
			{
				var insertCmd = connection.CreateCommand();

				insertCmd.CommandText = $"INSERT INTO nodes VALUES('{rootId}', 'Root', null)";
				insertCmd.ExecuteNonQuery();

				var list = new List<Tuple<Guid, Guid>>();

				MakeChildren(rootId, 4, list);

				// shuffle 
				Random rng = new Random();
				list = list.OrderBy(a => rng.Next()).ToList();

				foreach(var item in list)
				{
					insertCmd.CommandText = $"INSERT INTO nodes VALUES('{item.Item1}', '', '{item.Item2}')";
					insertCmd.ExecuteNonQuery();
				}
				
				transaction.Commit();
			}

			var selectCmd = connection.CreateCommand();
			selectCmd.CommandText = $@"
	WITH RECURSIVE
	tree_of(id, depth) AS (
	VALUES('{rootId}', 0)
	UNION ALL
	SELECT nodes.id, depth+1 FROM nodes, tree_of
	WHERE nodes.parent=tree_of.id
	ORDER BY 2 DESC
	)
	SELECT n.id, n.name, tree_of.depth FROM tree_of
	join nodes n on tree_of.id = n.id
	;";

			var i = 0;
			var sw = Stopwatch.StartNew();
			using (var reader = selectCmd.ExecuteReader())
			{
				while (reader.Read())
				{
					var id = reader.GetString(0);
					var name = reader.GetString(1);
					var depth = reader.GetInt32(2);
					var tabs = new string('\t', depth);
					i++;
					//_testOutputHelper.WriteLine($"{tabs}{{{id}}} {name}");
				}
			}

			_testOutputHelper.WriteLine($"{sw.ElapsedMilliseconds} ms");
			_testOutputHelper.WriteLine($"{i:N0} records");
			_testOutputHelper.WriteLine($"{i/50:N0} pages");
		}
	}

	private void MakeChildren(Guid parentId, int depth, List<Tuple<Guid, Guid>> list)
	{
		if(depth == 0)
		{
			return;
		}
		for(var i = 0; i < 10; i++)
		{
			var newId = Guid.NewGuid();

			list.Add(new (newId, parentId));
			MakeChildren(newId, depth-1, list);
		}
	}
