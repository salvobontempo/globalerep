class Nominativo {
    constructor(cognome,  nome, telefono) {
        var completo = cognome;        
        var sep = completo.includes(",") ? "," : " ";
        var a = (completo + sep + sep ).split(sep);
        this.title =  $("#dropbtn_title").text();
        this.cognome = a[0];
        this.nome = nome || a[1];
        this.telefono = telefono || a[2];
    }  
}

class Titolo {
    constructor(descrizione,  visualizzaOrdine, visualizza) {        
        this.descrizione = descrizione
        this.visualizzaOrdine= parseInt(visualizzaOrdine)
        this.visualizza =parseInt(visualizza)
        
    }   
    visualizzaInt()  {
        return this.visualizza?1:0
    }   
}


