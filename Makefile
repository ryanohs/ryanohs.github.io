build:
	./_lib/StaticSiteGenerator .

dev:
	../StaticSiteGenerator/StaticSiteGenerator/bin/Debug/net7.0/StaticSiteGenerator .
	
run:
	python3 ./_lib/server.py

.PHONY: dev, build, run