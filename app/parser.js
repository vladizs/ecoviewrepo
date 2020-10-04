const cron = require('node-cron');
const axios = require('axios').default;
const cheerio = require('cheerio');
const parseList = require('../config/parserSettings').parseList;

module.exports.startUpdater = function(db) {
    let counter = 0;
    let updater = cron.schedule('*/4 * * * * *', () => {
        let station = parseList[counter];
        counter++;
        if (counter == parseList.length) {
            counter = 0;
            updater.stop();
        }
        db.collection('almaty_stations').findOne({name: station.name}, (err, result) => {
            if (err) {
                console.log('An error has occurred');
                return;
            } else {
                if (result == null) { //If document doesn't exist in collection
                    axios.get(station.url).then(response => { //Initializing and parsing data value from website
                        let content = cheerio.load(response.data);
                        let text = content('.aqi-value__value').html();
                        let data = text.replace('<!---->', '').trim(); //There's a strange comment in a website's code

                        const stationInfo = { //Creating object with all info
                            name: station.name, 
                            friendlyNames: {
                                name_en: station.friendlyNames.name_en,
                                name_ru: station.friendlyNames.name_ru
                            },
                            data: parseInt(data), 
                            date: new Date().getTime()
                        };
                        db.collection('almaty_stations').insert(stationInfo, (err, result) => { //Inserting new document to collection
                            if (err) {
                                console.log('An error has occured when inserting data of ' + station.name);
                            }
                        });
                    }).catch(error => {
                        console.log('An error has occured when parsing data of ' + station.name);
                    });
                } else {
                    axios.get(station.url).then(response => { //Initializing and parsing data value from website
                        let content = cheerio.load(response.data);
                        let text = content('.aqi-value__value').html();
                        let data = text.replace('<!---->', '').trim(); //There's a strange comment in a website's code

                        //If friendly names has been changed in config(or added) they are will be overwrite
                        const stationInfo = result.friendlyNames === station.friendlyNames ? {$set: {data: parseInt(data), date: new Date().getTime()}} : { //Creating object with all info without name parameter
                            $set: {
                                friendlyNames: station.friendlyNames,
                                data: parseInt(data),
                                date: new Date().getTime()
                            }
                        };
                        db.collection('almaty_stations').findOneAndUpdate({name: station.name}, stationInfo, (err, result) => {
                            if (err) {
                                console.log('An error has occurred when modifying data of ' + station.name);
                            }
                        })
                    }).catch(error => {
                        console.log('An error has occured when parsing data of ' + station.name);
                    });
                }
            }
        })
    })
    cron.schedule('*/10 * * * *', () => {
        updater.start();
    });
}