import csv
import json

Jason = open("KNMI_2017.json", "w")
CSV = open("KNMI_2017.csv", "r")

in_CSV = csv.DictReader(CSV, ("Date","Mean", "Min", "max"))
Jason.write("[")
i = 0
for date_temp in in_CSV:
    if i == 0: 
        i = i + 1
    else:
        Jason.write(",")
    json.dump(date_temp, Jason)
Jason.write("]")