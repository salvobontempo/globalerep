
var createSQLTitoloController = function (db) {
     db.changeVersion('2.0', '3.0', function (tx) {
        var sql = " CREATE TABLE Titolo("
        sql += " id INTEGER PRIMARY KEY AUTOINCREMENT,"
        sql += " descrizione TEXT(255)      NOT NULL,"
        sql += " visualizzaOrdine INTEGER      NOT NULL,"
        sql += " visualizza BOOLEAN DEFAULT TRUE)"
        tx.executeSql(sql, [], function (tx, data) {
            console.log(data);
        }, function (tx, error) {
            console.log(error);
        });
        var sqls = [];
        sqls.push("INSERT INTO Titolo (Descrizione, VisualizzaOrdine) VALUES ('sig.',10)");
        sqls.push("INSERT INTO Titolo (Descrizione, VisualizzaOrdine) VALUES ('sig.ra',20)");
        sqls.push("INSERT INTO Titolo (Descrizione, VisualizzaOrdine) VALUES ('sig.na',30)");
        sqls.forEach(function (itm) {
            tx.executeSql(itm, [], function (tx, data) {
                console.log(data);
            }, function (tx, error) {
                console.log(error);
            });

        })

    })

    return {
        "create": function (m, cb) {
            db.transaction(function (tx) {
                var sql = 'INSERT INTO Titolo(Descrizione, VisualizzaOrdine, Visualizza) VALUES (?, ?, ?)'
                tx.executeSql(sql, [m.descrizione, m.visualizzaOrdine, m.visualizza?1:0]
                    , function (tx, data) {
                        m.id = data.insertId;
                        cb(m)
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
            });
        },
        "read": function (cb, all) {                        
            db.transaction(function (tx) {
                var sql='SELECT * FROM Titolo';
                if(!all)
                    sql+=' WHERE visualizza=true';
                sql += " ORDER BY VisualizzaOrdine"
                tx.executeSql(sql, [], function (tx, data) {
                    cb(data)
                });
            });
        },
        "update": function (m, cb) {
            db.transaction(function (tx) {                    
                tx.executeSql('UPDATE Titolo SET Descrizione =  ?, VisualizzaOrdine = ?, Visualizza = ? WHERE id = ?'
                    , [m.descrizione, m.visualizzaOrdine, m.visualizza?1:0 , m.id]
                    , function (tx, data) {
                        if(cb)cb(data);
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
            });
        },
        "delete": function (m) {
            var id = isNaN(m) ? m.id : m;            
            db.transaction(function (tx) {
                tx.executeSql('DELETE FROM Titolo WHERE id = ?', [id]
                    , function (tx, data) {
                        console.log(data);
                    }, function (tx, error) {
                        console.log(error);
                    });
            });
        },
        "maxVisualizzaOrdine": function (cb) {
            db.transaction(function (tx) {
                tx.executeSql('Select Max(visualizzaOrdine) as ultimo FROM Titolo', []
                    , function (tx, data) {
                        console.log("maxVisualizzaOrdine" + data);
                        cb(data.rows[0].ultimo);
                    }, function (tx, error) {
                        console.log("errrore" + error);
                    });
            });
        },
        "renumber": function (cb) {
            db.transaction(function (tx) {
                var fupdate = function (id, num, cbupdate) {
                    tx.executeSql('UPDATE Titolo SET VisualizzaOrdine = ? WHERE id = ?'
                        , [num, id]
                        , function (tx, data) {
                            if (cbupdate) cbupdate(data);
                            //console.log(data);
                        }, function (tx, error) {
                            //console.log(error);
                        });
                }
                var contatore = 0;
                var sql = 'SELECT * FROM Titolo ORDER BY VisualizzaOrdine';
                tx.executeSql(sql, [], function (tx, data) {                    
                    $.each( data.rows,  function(idx, itm) {
                        contatore += 10;
                        fupdate(itm.id, contatore, function(data){
                            if(idx == data.rows.length ) {
                                cb();
                            }
                        })
                        //console.log(idx, itm)
                    })                    
                });
            });
        },
    }
}

var getObject = function (m) {
    var o = {
        descrizione: m.descrizione,
        visualizza: parseInt(m.visualizza),
        visualizzaOrdine: parseInt(m.visualizzaOrdine)
    } 
    if(o.id) o.id = parseInt( m.id );
    return o
}

var createIndexDBTitoloController = function(db) {
    var addTitolo = function(m, cb) {        
                var trans = db.db.transaction("titolo", "readwrite");
                var store = trans.objectStore("titolo");
                var o = getObject(m)
                var request = store.put(  o );
                request.onsuccess = function(e) {                    
                    cb(m)
                }
                request.onerror = function(e) {
                    console.log(e);
                }
            };
    
            var updateTitolo = function(m, cb) {        
                var trans = db.db.transaction("titolo", "readwrite");
                var store = trans.objectStore("titolo");
                var o = getObject(m)
                var request = store.put(  o , o.id);
                request.onsuccess = function(e) {                    
                    cb(m)
                }
                request.onerror = function(e) {
                    console.log(e);
                }
            };
    var deleteTitolo = function (id, cb) {
        var trans = db.db.transaction("titolo", "readwrite");
        var store = trans.objectStore("titolo");
        var request = store.delete(id);
        request.onsuccess = function (e) {
            if( cb ) cb(id)
        }
        request.onerror = function (e) {
            console.log(e);
        }
    };

    var readAll = function(cb) {
                var data = {rows: []};
                var trans = db.db.transaction("titolo", "readonly");
                var store = trans.objectStore("titolo");
                const ordineIndex = store.index('visualizzaOrdineIndex');
                const keyRng = IDBKeyRange.upperBound(999999);
                var cursor = ordineIndex.openCursor(keyRng);
                cursor.onsuccess = function(event) {
                    const c = event.target.result;
                    if(c) {
                        console.log(  c );
                        data.rows.push(c.value)                            
                        c.continue();
                    } else {
                        //alert("finish readAll")                
                        cb(data)
                    }
                }                    
            }   

    var maxOrdine = function (cb) {
        var trans = db.db.transaction("titolo", "readwrite");
        var store = trans.objectStore("titolo");
        const ordineIndex = store.index('visualizzaOrdineIndex');
        const keyRng = IDBKeyRange.upperBound(999999);
        var cursor = ordineIndex.openCursor(keyRng, "prev");
        cursor.onsuccess = function (e) {
            const c = event.target.result;
            if (c) {
                var titolo = c.value;
                cb(titolo.visualizzaOrdine)
                console.log(c);
            } else {
                cb(0)
            }            
        }       
    }


    return {
        "maxVisualizzaOrdine": function(cb) {
            maxOrdine(cb);
        }, 
        "create": function (m, cb) {            
            addTitolo(m, cb);
        },
        "read": function (cb, all) {            
            if(all) {                                
                if(db.db) {
                    readAll(cb)
                } else {
                    db.request.onsuccess = function(e) {
                        db.db = e.target.result;
                        readAll(cb)
                    }
                }
            }
            //alert(db.db)
        },
        "update": function (m, cb) {
            var o = getObject(m);
            console.log(o)
            updateTitolo(o, cb);
        },
        "delete": function (id, cb) {            
            deleteTitolo( parseInt( id ), cb)
        }
    }
}

//var createTitoloController =  window.openDatabase?createSQLTitoloController:createIndexDBTitoloController;

var createTitoloController =  createIndexDBTitoloController;


