var express = require('express');
var bodyParser = require('body-parser');
var sql = require("mssql/msnodesqlv8");

var config = require('./dbconfig')

var app = express();
var router = express.Router();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())


app.get('/', function (req, res) {

    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        request.query('select count(*) from trainee_apln', function (err, recordset) {
            if (err) console.log(err)

            res.send(recordset);

        });
    });
});

app.post('/login', function (req, res) {

    console.log(req.body);

    const userId = req.body.user;
    const password = req.body.password;

    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        request.input('sap_number', sql.VarChar, userId);
        request.input('temp_password', sql.VarChar, password);

        request.query("select top 1 mobile_no1, biometric_no from trainee_apln where sap_number=@sap_number and temp_password=@temp_password and apln_status = 'appointed'", function (err, recordset) {
            if (err) console.log(err)

            console.log(recordset);

            res.status(200).json({ data: { mobile: recordset["recordset"][0]["mobile_no1"], userBiometric: recordset["recordset"][0]["biometric_no"] } });

        });
    });
});

app.get('/attendanceOfDay', function (req, res) {

    console.log(req.query);

    const date = req.query.date;
    const userBiometric = req.query.userBiometric;

    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        request.input('userBiometric', sql.VarChar, userBiometric);
        request.input('date', sql.Date, date);

        request.query("select top 1 VARTIME from Punch_Data p inner join trainee_apln t on p.SWIPEID = t.biometric_no where t.biometric_no=@userBiometric and VARTYPE='I' and VARDATE=@date order by VARTIME", function (err, recordset1) {
            if (err) { console.log(err); return res.json({ data: null }); }
            console.log(recordset1);
            if (recordset1['recordset'].length == 0)
                return res.json({ data: null });

            request.query("select top 1 VARTIME from Punch_Data p inner join trainee_apln t on p.SWIPEID = t.biometric_no where t.biometric_no=@userBiometric and VARTYPE='O' and VARDATE=@date order by VARTIME DESC", function (err, recordset2) {
                if (err) console.log(err)

                if (recordset2['recordset'].length == 0)
                    return res.json({ data: { inTime: recordset1['recordset'][0]['VARTIME'], outTime: 'Missing' } });

                res.json({ data: { inTime: recordset1['recordset'][0]['VARTIME'], outTime: recordset2['recordset'][0]['VARTIME'] } });
                // res.status(200).json({ mobile: recordset["recordset"][0]["mobile_no1"] });


            });

            // res.append({ in_time: recordset1 });
            // res.status(200).json({ mobile: recordset["recordset"][0]["mobile_no1"] });


        });
    });
});


app.get('/test', function (req, res) {
    sql.connect(config, function (err) {

        if (err) console.log(err);

        var request = new sql.Request();

        request.query("select VARTIME from Punch_Data p inner join trainee_apln t on p.SWIPEID = t.biometric_no where t.biometric_no='8002' and VARTYPE='O' and VARDATE='2022-07-07' order by VARTIME DESC", function (err, recordset) {
            if (err) console.log(err)

            res.send({ data: recordset['recordset'] });


        });
    });
});


app.get('/profile', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        console.log('profile');

        const userBiometric = req.query.userBiometric;

        var request = new sql.Request();

        request.input('userBiometric', sql.VarChar, userBiometric);

        request.query("select fullname, dept_slno, apln_slno, doj, birthdate, desig_slno, mobile_no1 from trainee_apln where biometric_no=@userBiometric", function (err, recordset) {
            if (err) console.log(err);

            let decodedData = recordset['recordset'][0];

            res.send({
                data: {
                    'fullname': decodedData['fullname'],
                    'department': decodedData['dept_slno'],
                    'empid': decodedData['apln_slno'],
                    'doj': decodedData['doj'],
                    'birthdate': decodedData['birthdate'],
                    'designation': decodedData['desig_slno'],
                    'contact_no': decodedData['mobile_no1'],
                    'email': 'example@email.com'
                }
            });
        });
    });
});



var server = app.listen(5000, function () {
    console.log('Server is running..');
});