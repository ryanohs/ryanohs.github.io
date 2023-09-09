---
layout: post
title: Mapping air quality
---

The smoke from Canadian wildfires affecting the US from coast to coast got me wondering if there was anywhere in the northern part of the country not impacted historically. I found a [dataset](https://aqs.epa.gov/aqsweb/airdata/download_files.html) of historical AQI by county on the EPA's website.

I created a US county map with d3.js and colored each county based on the air quality index. Unfortunately the EPA's dataset is very spotty, covering only about 1/3 of counties. I was unable to derive an answer to my original question.

I used the Albers geoJSON dataset and learned about FIPS codes for mapping the EPA data to the Albers data. The EPA's county names did not completely align with the FIPS dataset so I altered the FIPS data since it was a single file to modify compared to many data files. I excluded any data points in the EPA data that did not easily map to the FIPS dataset.

I publishing the resulting [maps](/demos/aqi/map.html) because I'll end up reusing the code for another project.

I also published a [script](https://gist.github.com/ryanohs/b59b639c38a3158f158c9ed1e31f787b) to download the EPA data.