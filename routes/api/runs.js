const express = require('express');
const uuid = require('uuid');
const json2csv = require ('json2csv');
const fs = require('fs');
const router = express.Router();
const runs = require('../../Runs');
const {google} = require('googleapis');

// Gets all runs
router.get('/', (req, res) => { 
    //res.json(runs)); 
    //res.format({
    //    'text/plain': function () {
    //        res.send(json2csv.parse(runs))
    //    }
    //  })
    //});
    try {
        const jsonString = fs.readFileSync ('./Runs.json', 'utf-8');
        runs2 = JSON.parse(jsonString);
    }   catch (err) {
        console.log(err);
    } 
    res.format({
        'text/plain': function () {
            res.send(json2csv.parse(runs2))
            }
        })
    });

// Get single run
router.get('/:id', (req, res) => {
    const found = runs.some(run => run.id === parseInt(req.params.id));

    if (found) {
    res.json(runs.filter(run => run.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({ msg: `No run found with the id of ${req.params.id}` });
    }
});

// Create Run
router.post('/', async (req, res) => {
    const team = JSON.parse(req.body.team);
    const newRun = {
        id: uuid.v4(),
        team_name: team.name,
        team_number: team.number,
        points: '0',
        ground_auto: req.body.ground_auto,
        low_auto: req.body.low_auto,
        medium_auto: req.body.medium_auto,
        high_auto: req.body.high_auto,
        auto_park: req.body.auto_park,
        auto_signal: req.body.auto_signal,
        cone_terminal: req.body.cone_terminal,
        ground_driver: req.body.ground_driver,
        low_driver: req.body.low_driver,
        medium_driver: req.body.medium_driver,
        high_driver: req.body.high_driver,
        owned_junctions: req.body.owned_junctions,
        endgame_park: req.body.endgame_park,
        penalty_points: req.body.penalties,
        notes: req.body.notes

        // This is from last season, not sure what it is but it could be useful later for creating runs
        // deliver_alliance: req.body.alliance_top*6+req.body.alliance_middle*4+req.body.alliance_bottom*2,
    }

    // if(!newRun.team_name || !newRun.team_number) {
    //     return res.status(400).json({ msg: 'Please fill out the entire form before submitting.' });
    // }
    // try {
    //     const jsonString = fs.readFileSync ('./Runs.json', 'utf-8');
    //     runs2 = JSON.parse(jsonString);
    // }   catch (err) {
    //     console.log(err);
    // }
    // runs2.push(newRun)

    // fs.writeFile('./Runs.json', JSON.stringify(runs2, null, 2), err => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('File successfully written');
    //     }
    // })

    const auth = new google.auth.GoogleAuth({
        keyFile: "googleCredentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    // create client instance for auth
    const client = await auth.getClient();

    const spreadsheetId = "1E014LyWnqvakega6tFdwAZHzStMX-pJtnA9roQQukH4";

    // instance of Google Sheets Api
    const googleSheets = google.sheets({version: "v4", auth: client});

    // get metadata about spread sheet
    // const metadata = await googleSheets.spreadsheets.get({
    //     auth,
    //     spreadsheetId,
    // })

    // read rows from spreadsheet
    // const getRows = await googleSheets.spreadsheets.values.get({
    //     auth,
    //     spreadsheetId,
    //     range: "Sheet1",
    // });

    // write row(s) to spreadsheet
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:P",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[newRun.id, newRun.team_name, newRun.team_number, newRun.points, newRun.ground_auto, newRun.low_auto, 
                      newRun.medium_auto, newRun.high_auto, newRun.auto_park, newRun.auto_signal, newRun.cone_terminal,
                      newRun.ground_driver, newRun.low_driver, newRun.medium_driver, newRun.high_driver, newRun.owned_junctions,
                      newRun.endgame_park, newRun.penalty_points, newRun.notes]]
        }
    });

    // res.redirect('/api/runs');
    res.redirect('/dataform.html');
});

// Update Run
router.put('/:id', (req, res) => {
    const found = runs.some(run => run.id === parseInt(req.params.id));

    if (found) {
        const updRun = req.body;
        runs.forEach(run => {
            if(run.id === parseInt(req.params.id)) {
            run.team_name = updRun.team_name ? updRun.team_name : run.team_name;
            run.team_number = updRun.team_number ? updRun.team_number : run.team_number;

            res.json({ msg: 'Run updated', run });
            }
        });
    } else {
        res.status(400).json({ msg: `No run found with the id of ${req.params.id}` });
    }
});

// Delete Run
router.delete('/:id', (req, res) => {
    const found = runs.some(run => run.id === parseInt(req.params.id));

    if (found) {
    res.json({ msg: 'Run deleted', runs: runs.filter(run => run.id !== parseInt(req.params.id))});
    } else {
        res.status(400).json({ msg: `No run found with the id of ${req.params.id}` });
    }
});

module.exports = router;


/* Saving old version of post request here in case the google method messes everything up
router.post('/', (req, res) => {
    const newRun = {
        id: uuid.v4(),
        team_name: req.body.team_name,
        team_number: req.body.team_number,
        points: '0',
        detect: req.body.detect,
        alliance_park_auto: req.body.alliance_park_auto,
        warehouse_park_auto: req.body.warehouse_park_auto,
        spin_carousel: req.body.spin_carousel,
        deliver_alliance: req.body.alliance_top*6+req.body.alliance_middle*4+req.body.alliance_bottom*2,
        deliver_shared: req.body.deliver_shared,
        barrier: req.body.barrier,
        ducks: req.body.ducks,
        alliance_park_end: req.body.alliance_park_end,
        warehouse_park_end: req.body.warehouse_park_end,
        tse: req.body.tse,
        penalty_points: req.body.penalties,
        notes: req.body.notes
    }

    if(!newRun.team_name || !newRun.team_number) {
        return res.status(400).json({ msg: 'Please fill out the entire form before submitting.' });
    }
    try {
        const jsonString = fs.readFileSync ('./Runs.json', 'utf-8');
        runs2 = JSON.parse(jsonString);
    }   catch (err) {
        console.log(err);
    }
    runs2.push(newRun)

    fs.writeFile('./Runs.json', JSON.stringify(runs2, null, 2), err => {
        if (err) {
            console.log(err);
        } else {
            console.log('File successfully written');
        }
    })

    // res.redirect('/api/runs');
    res.redirect('/dataform.html');
});
*/
