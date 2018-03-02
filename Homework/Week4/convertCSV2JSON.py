import csv
import json

Jason = open("happyData.json", "w")
CSV = open("happyData.csv", "r")

in_CSV = csv.DictReader(CSV, ("HPIRank","Country","Region","AverageLifeExpectancy","AverageWellbeing","HappyLifeYears","Footprint","InequalityofOutcomes","InequalityAdjustedLifeExpectancy","InequalityAdjustedWellbeing","HappyPlanetIndex","GDPCapita","Population"))
Jason.write("[")
i = 0
for date_temp in in_CSV:
    if i == 0: 
        i = i + 1
    else:
        Jason.write(",")
    json.dump(date_temp, Jason)
Jason.write("]")