const templateOption1 = "<a class='dropdown-item' href='#'>XXXX</a>"
const templateOption2 = "<option></option>"
const templateRiga = "<tr class='table-dark'>"
    + "<th id='id'>0</th>"
    + "<th id='descrizione'></th>"
    + "<th id='visualizza_ordine'>Dark</th>"
    + "<td align=center><input disabled type=checkbox id='visualizza' /></td>"    
    + "<td ><button id='modify' class='btn btn-secondary'>Modifica</button>"
    + "&nbsp;<button id='delete' class='btn btn-secondary'>Elimina</button></td>"
    + "</tr>";
var db = openDB()
var ctlRubrica = createRubricaController(db);
var ctlTitolo = createTitoloController(db);

function loadTable() {
    ctlTitolo.read(function (data) {
        $("#elenco").empty();
        $.each(data.rows, function (idx, itm) {
            addRow(itm);
        })
    }, true);
}

$(document).ready(function () {
    // carica la tabella    
    loadTable();
    
    $("#rinumera").click(function () {
        ctlTitolo.renumber(function() {            
            loadTable();
        });
    });


    $("#testbtn").click(function () {
        $('#staticBackdrop').modal('show');
    });
    $("#list_title a").click(function () {
        $("#dropbtn_title").text($(this).text());
    })
    $("#aggiungifull").click(function () {
        ctlTitolo.maxVisualizzaOrdine(function (ultimo) {
            var o = new Titolo($("#completo").val(), ultimo + 10, true)
            $('#dialog_descrizione').val(o.descrizione);
            $('#dialog_visualizza_ordine').val(o.visualizzaOrdine);
            $('#dialog_visualizza').prop("checked", o.visualizza);
            $('#save').off('click');
            $('#save').click(function () {
                o.descrizione = $('#dialog_descrizione').val()
                o.visualizzaOrdine = $('#dialog_visualizza_ordine').val()
                o.visualizza = $('#dialog_visualizza').prop("checked")
                ctlTitolo.create(o, function (m) {
                    loadTable();
                    //addRow(o);
                });
                $('#staticBackdrop').modal('hide');
                $("#completo").val("")
            });
            $('#dialog_id').text("");
            $('#staticBackdropLabel').text("Aggiungi")
            $('#staticBackdrop').modal('show');
        });
    })
    $("#aggiungi").click(function () {
        ctlTitolo.maxVisualizzaOrdine(function (ultimo) {
            var o = new Titolo($("#completo").val(), ultimo + 10, 1)
            if (o.descrizione == "") {
                alert("Specificare un titolo");
                $("#completo").focus();
                return;
            }
            ctlTitolo.create(o, function (o) {
                loadTable();
                //addRow(o)
            });
            $("#completo").val("")
        })
    })

});
function addRow(o) {    
    var row = $(templateRiga);
    row.find("#id").text(o.id);
    row.find("#descrizione").text(o.descrizione);
    row.find("#visualizza_ordine").text(o.visualizzaOrdine);
    row.find("#visualizza").prop("checked", o.visualizza);    
    
    row.find("#modify").click(function () {
        var a = $(this).parentsUntil("tbody");
        var tr = a[a.length - 1];
        $('#dialog_id').text(parseInt($(tr).find("#id").text()))
        $('#dialog_descrizione').val($(tr).find("#descrizione").text());
        $('#dialog_visualizza_ordine').val($(tr).find("#visualizza_ordine").text());
        $('#dialog_visualizza').prop("checked",$(tr).find("#visualizza").prop("checked"));        
        $('#save').off('click');
        $('#save').click(function () {
            console.log($('#dialog_visualizza').prop("checked"))
            console.log(tr)
            var o = new Titolo($('#dialog_descrizione').val(),
                 $('#dialog_visualizza_ordine').val(),
                 $('#dialog_visualizza').prop("checked"))            

            o.id = $('#dialog_id').text()
            /*            
            $(tr).find("#descrizione").text(o.descrizione)
            $(tr).find("#visualizza_ordine").text(o.visualizzaOrdine)
            $(tr).find("#visualizza").prop("checked",o.visualizza)            
            */           
            ctlTitolo.update(o, function(){
                loadTable();
            });            
            $('#staticBackdrop').modal('hide');
        });
        $('#staticBackdropLabel').text("Modifica")
        $('#staticBackdrop').modal('show');
    });
    row.find("#delete").click(function () {
        var a = $(this).parentsUntil("tbody");
        $.each(a, function (indx, itm) {
            console.log(itm.nodeName)
        });
        var tr = a[a.length - 1];
        ctlTitolo.delete(parseInt($(tr).find("#id").text()))
        if (!confirm("Eliminare la riga corrente?")) return;
        $(tr).remove();
    });
    $("#elenco").append(row);
}
