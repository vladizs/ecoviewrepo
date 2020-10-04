# Eco View Website
https://ecoview-spaceapps.000webhostapp.com/

# API EcoView website
All API requests are going to `https://ecoview-spaceapps.herokuapp.com/api/*`, for example `https://ecoview-spaceapps.herokuapp.com/api/get_stations`

### get_stations
Response with array `Array` with objects `Object`.
Every object of array has:

 - _id - *unique id of object in MongoDB database*
 - name - *Station's indexed name*
 - friendlyNames:
   - name_en - *Friendly name of location on English*
   - name_ru - *Friendly name of location on Russian*
 - data - *Air quality index*
 - date - *timestamp of last update of station data*
### get_station
Accepts string `name` in a format of query `(api/get_station?name=station_name)`
`name` - station's indexed name 
Response with object `Object`, that has:
 - _id - *unique id of object in MongoDB database*
 - name - *Station's indexed name*
 - friendlyNames:
   - name_en - *Friendly name of location on English*
   - name_ru - *Friendly name of location on Russian*
 - data - *Air quality index*
 - date - *timestamp of last update of station data*
