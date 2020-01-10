$(document).ready(function () {
    var versione = 1;
    var db ;
    var request = indexedDB.open("mioindexdb", versione)
    request.onupgradeneeded = function(event)  {
        alert("onupgradeneeded")
        db = event.target.result;
        alert(db.version)
		if(db.objectStoreNames.contains("utenti")) {
            alert("Elimino tutti gli utenti")
			db.deleteObjectStore("utenti");
		}
        //var store = db.createObjectStore("utenti", {keyPath: "id"});
        
        var store = db.createObjectStore("utenti", {keyPath: "id", autoIncrement : true});
        store.createIndex('attivoIndex', 'attivo', { unique: false });
        store.createIndex('ordineIndex', 'ordine', { unique: false });

    }      

    var addUtente = function(utente) {        
        var trans = db.transaction("utenti", "readwrite");
        var store = trans.objectStore("utenti");
        var request = store.put(utente);
        request.onsuccess = function(e) {
            console.log("Utente inserito correttamente!");
        }
        request.onerror = function(e) {
            console.log(e);
        }
    };


    


    var deleteUtente = function(idutente) {        
        var trans = db.transaction("utenti", "readwrite");
        var store = trans.objectStore("utenti");
        var request = store.delete(idutente);
        request.onsuccess = function(e) {
            console.log("Utente inserito correttamente!");
        }
        request.onerror = function(e) {
            console.log(e);
        }
    };

    var leggiMaxOrdine = function() {
        var trans = db.transaction("utenti", "readwrite");
        var store = trans.objectStore("utenti");
        const ordineIndex = store.index('ordineIndex');
        const keyRng = IDBKeyRange.upperBound(999999);
        var cursor = ordineIndex.openCursor(keyRng, "prev");
        cursor.onsuccess = function(e) {
            const c = event.target.result;
            if(c) {
                console.log(  c  );
                //if (c.value.id==4) c.delete();
                //c.value.lettino = new Date()
                //c.update(c.value);
                //console.log( JSON.stringify( c.value ) );
                //console.log(c.key + " = " + JSON.stringify( c.value ) )
                //c.continue();
            } else {
                alert("finish")                
            }
           //var cursor = event.target.result;
            //console.log("Utente inserito correttamente!");
        }
    }

    var leggiUtenti = function() {        
        var trans = db.transaction("utenti", "readwrite");
        var store = trans.objectStore("utenti");

        const attivoIndex = store.index('attivoIndex');
        const keyRng = IDBKeyRange.only(1);

        var cursor = store.openCursor(null, "prev");
        //var cursor = attivoIndex.openCursor(keyRng, "prev");

        cursor.onsuccess = function(e) {
            const c = event.target.result;
            if(c) {
                console.log(  c );
                //if (c.value.id==4) c.delete();
                //c.value.lettino = new Date()
                //c.update(c.value);
                //console.log( JSON.stringify( c.value ) );
                //console.log(c.key + " = " + JSON.stringify( c.value ) )
                c.continue();
            } else {
                alert("finish")                
            }
           //var cursor = event.target.result;
            //console.log("Utente inserito correttamente!");
        }
        cursor.onerror = function(e) {
            alert("errore")
            console.log(e);
        }
    };

    var leggiTutto = function() {
        var trans = db.transaction("utenti", "readwrite");
        var store = trans.objectStore("utenti");
        store.getAll().onsuccess = function(event) {
            console.log(event.target.result);
          };
    }
   
    request.onsuccess = function(event) {
        db = event.target.result;
        addUtente({id:1, cognome: "Bontempo2",  ordine:10, attivo: 1, nome:"Salvo", "altezza":178})
        addUtente({id:2, cognome: "Rossiccio2", ordine:40, attivo: 0,})        
        addUtente({id:3, cognome: "Bianchi2", ordine:90, attivo: 1,nome:"Giacomo", "eta":25 })        
        addUtente({id:4, cognome: "Vinci2" , ordine:5,attivo: 0, nome:"Andrea", "peso":75 })        
        //deleteUtente(4);

        //leggiUtenti();
        //leggiTutto();
        leggiMaxOrdine();
	}
	request.onerror = function(event) {
		alert("Si è verificato un errore nell'apertura del DB");
    }    



});

