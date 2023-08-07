#load data from data folder with mongoimport command
#use a for loop to load all the json files in the data folder

for filename in data/*.json; do
    collection=$(basename $filename .json)
    mongoimport --uri=mongodb://localhost:27017 --collection=$collection --file=$filename
done