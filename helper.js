function openDB(){
    /*
    if(window.openDatabase)
        return openDatabase('dbrubrica', '', 'Rubrica industriale', 2 * 1024 * 1024);
    */   
    if(window.indexedDB) {
        var obj = {
            versione: 1,
            db: null
        }            
            obj.request = indexedDB.open("rubrica_indexdb", obj.versione)
            obj.request.onupgradeneeded = function(event)  {                
                obj.db = event.target.result;                
                if(obj.db.objectStoreNames.contains("rubrica")) {                    
                    obj.db.deleteObjectStore("rubrica");
                }
                if(obj.db.objectStoreNames.contains("titolo")) {                    
                    obj.db.deleteObjectStore("titolo");
                }
                //var store = db.createObjectStore("utenti", {keyPath: "id"});
                
                var store = obj.db.createObjectStore("rubrica", {keyPath: "id", autoIncrement : true});
                
                store = obj.db.createObjectStore("titolo", {keyPath: "id", autoIncrement : true});
                store.createIndex('visualizzaOrdineIndex', 'visualizzaOrdine', { unique: false });
                store.createIndex('visualizza', 'visualizza', { unique: false });

            }      
            obj.request.onsuccess = function(event) {
                obj.db = event.target.result;
            }

            return obj
    }

}