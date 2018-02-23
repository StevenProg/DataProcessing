import csv
import json

Jason = open("temps.json", "w")
CSV = open("temps.csv", "r")

in_CSV = csv.DictReader(CSV, ("Date","Temp"))
Jason.write("[")
i = 0
for date_temp in in_CSV:
    if i == 0: 
        i = i + 1
    else:
        Jason.write(",")
    json.dump(date_temp, Jason)
Jason.write("]")