
module.exports = function(app, db) {
    // app.post('/api/add_station', (req, res) => {
    //     const stationInfo = {name: req.body.name, data: parseInt(req.body.data), date: new Date().getTime()};
    //     if (req.body.name == null || req.body.data == null) {
    //         res.send({error: 'Not enough arguments'});
    //     } 
    //     db.collection('almaty_stations').insert(stationInfo, (err, result) => {
    //         if (err) {
    //             res.send({error: "An error has occurred"});
    //         } else {
    //             res.send(result.ops[0]);
    //         }
    //     });
    // });

    app.get('/api/get_stations', async (req, res) => {
        let stations = [];
        await db.collection('almaty_stations').find().forEach(data => {
            stations.push(data);
        });
        res.send(JSON.stringify(stations));
    });

    // app.post('/api/modify_station', (req, res) => {
    //     const stationInfo = {$set: {data: parseInt(req.body.data), date: new Date().getTime()}};
    //     if (req.body.name == null || req.body.data == null) {
    //         res.send({error: 'Not enough arguments'});
    //     } 
    //     db.collection('almaty_stations').findOneAndUpdate({name: req.body.name}, stationInfo, (err, result) => {
    //         if (err) {
    //             res.send({error: 'An error has occurred'});
    //         } else {
    //             res.send(result.value);
    //         }
    //     });
    // });
    
    app.get('/api/get_station', (req, res) => {
        if (req.query.name == null) {
            res.send({error: 'Not enough arguments'});
        } 
        db.collection('almaty_stations').findOne({name: req.query.name}, (err, result) => {
            if (err) {
                res.send({error: 'An error has occurred'});
            } else {
                if (result == null) {
                    res.send({error: 'Station not found'});
                } else {
                    res.send(result);
                }
            }
        });
    });

    app.get('*', (req, res) => {
        res.status(404).send({error: 'Method not found'});
    })
};