$(document).ready(function () {
    var db = openDatabase('mydb', '', 'Test DB', 2 * 1024 * 1024);
    alert(db.version)
    db.changeVersion('', '1.0', function(tx) {
        var sql = "ALTER TABLE logs ADD descrizione TEXT"
        tx.executeSql(sql, [], function (tx, data) {
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
        alert("cambiamento di versione")
    })


    db.changeVersion('2.0', '3.0', function(tx) {
        var sql = "ALTER TABLE logs ADD descrizione TEXT"
        tx.executeSql(sql, [], function (tx, data) {
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
        alert("cambiamento di versione")
    })

    db.changeVersion('3.0', '3.1', function(tx) {
        var sql = "ALTER TABLE logs ADD numero Integer"
        tx.executeSql(sql, [], function (tx, data) {
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
        alert("cambiamento di versione aggiunto numero")
    })





    checkDatabase(db);
    var ctl = createController(db);
    
    ctl.create( createModel( 51, 'asdasdxtrentuno', 'descrizoone', 3) )
    ctl.create( createModel( 52, 'sabfdgxtrentadue', 'sdkdsfjk', 33) )
    
    /*
    ctl.read(function (data) {
        console.log("ci sono " + data.rows.length + " elementi")
        console.log(data.rows[0].id + " " + data.rows[1].log)
    })
    ctl.update(1, 'nuovo nome')
    ctl.delete(1)
    */

});

function createModel(id, log, descrizione, numero) {
    return {
        "id": id,
        "log": log,
        "descrizione": descrizione,
        "numero": numero,
    }
};
function checkDatabase(db) {
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
        tx.executeSql('INSERT INTO LOGS(id, log) VALUES ( 1, "foobar")');
        tx.executeSql('INSERT INTO LOGS(id, log) VALUES ( 2, "logmsg")');
        tx.executeSql('INSERT INTO LOGS(id, log) VALUES ( 3, "prova")');
        tx.executeSql('INSERT INTO LOGS(id, log) VALUES ( 4, "sdsdss")');

        tx.executeSql('INSERT INTO LOGS(id, log) VALUES ( ?, ?)', [5, 'stringa'], function (tx, data) {
            //console.log(data);
        });
        //alert("Tabella creata ciao")
    });
}


function createController(db) {
    return {
        "create": function (m) {
            db.transaction(function (tx) {
                var sql  = 'INSERT INTO LOGS(id, log, descrizione, numero) VALUES ( ?, ?, ?, ?)'
                tx.executeSql(sql, [m.id, m.log, m.descrizione, m.numero]
                    , function (tx, data) {
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
            });
        },
        "read": function (cb) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM LOGS', [], function (tx, data) {
                    cb(data)
                    //console.log(data);
                    //alert("ci sono");
                });
            });
        },
        "update": function (m) {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE LOGS SET  log = ?, descrizione = ?, numero = ? WHERE id = ?', [m.log, m.descrizione, m.numero, m.id]
                    , function (tx, data) {
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
            });
        },
        "delete": function (m) {
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM logs WHERE id = ?', [m.id]
                    , function (tx, data) {
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
            });
        }
    }
}


