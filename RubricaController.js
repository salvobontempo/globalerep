var createSQLRubricaController = function(db) {
    db.changeVersion('', '1.0', function (tx) {
        var sql = " CREATE TABLE rubrica("
        sql += " id INTEGER PRIMARY KEY AUTOINCREMENT,"
        sql += " cognome TEXT      NOT NULL,"
        sql += " nome TEXT      NOT NULL,"
        sql += " telefono TEXT      NOT NULL )"
        tx.executeSql(sql, [], function (tx, data) {
            console.log(data);
        }, function (tx, error) {
            console.log(error);
        });
    })
    db.changeVersion('1.0', '2.0', function (tx) {
        var sql = "ALTER TABLE Rubrica ADD title TEXT"
        tx.executeSql(sql, [], function (tx, data) {
            console.log(data);
        }, function (tx, error) {
            console.log(error);
        });
    })

    return {
        "create": function (m, cb) {
            db.transaction(function (tx) {
                var sql = 'INSERT INTO rubrica(title ,cognome, nome, telefono) VALUES (?, ?, ?, ?)'
                tx.executeSql(sql, [m.title, m.cognome, m.nome, m.telefono]
                    , function (tx, data) {
                        m.id = data.insertId;
                        cb(m)
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
            });
        },
        "read": function (cb) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM rubrica', [], function (tx, data) {
                    cb(data)
                });
            });
        },
        "update": function (m) {
            db.transaction(function (tx) {
                tx.executeSql('UPDATE rubrica SET title =  ?, cognome = ?, nome = ?, telefono = ? WHERE id = ?'
                    , [m.title, m.cognome, m.nome, m.telefono, m.id]
                    , function (tx, data) {
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
            });
        },
        "delete": function (m) {
            var id = isNaN(m) ? m.id : m;
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM rubrica WHERE id = ?', [id]
                    , function (tx, data) {
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
            });
        }
    }
}



var createIndexDBRubricaController = function(db) {
    return {
        "create": function (m, cb) {
          alert("create")
        },
        "read": function (cb) {
            alert("read")
        },
        "update": function (m) {
            alert("update")
        },
        "delete": function (m) {
            alert("delete")
        }
    }
}

//var createRubricaController =  window.openDatabase?createSQLRubricaController:createIndexDBRubricaController;

var createRubricaController =  createIndexDBRubricaController;




















