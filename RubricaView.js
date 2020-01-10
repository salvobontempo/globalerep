const templateOption1 = "<a class='dropdown-item' href='#'>XXXX</a>"
const templateOption2 = "<option></option>"
const templateRiga = "<tr class='table-dark'>"
    + "<th id='id'>0</th>"
    + "<th id='title'></th>"
    + "<th id='surname'>Dark</th>"
    + "<td id='name'>Column content</td>"
    + "<td id='phone'>Column content</td>"
    + "<td><button id='modify' class='btn btn-secondary'>Modifica</button>"
    + "&nbsp;<button id='delete' class='btn btn-secondary'>Elimina</button></td>"
    + "</tr>";
    
var db = openDB();
var ctlRubrica = createRubricaController(db);
var ctlTitolo = createTitoloController(db);
$(document).ready(function () {
    
    

    ctlTitolo.read(function (data) {
        $.each(data.rows, function (idx, itm) {
            var option1 = $(templateOption1);            
            option1.text(itm.descrizione);            
            option1.click(function () {
                $("#dropbtn_title").text($(this).text());
            })
            $("#list_title").append(option1);

            var option2 = $(templateOption2);            
            option2.text(itm.descrizione);
            $("#dialog_title").append(option2);
            
        })
    });


    // carica la tabella
    ctlRubrica.read(function (data) {
        $.each(data.rows, function (idx, itm) {
            addRow(itm);
        })
    });
    $("#testbtn").click(function () {
        $('#staticBackdrop').modal('show');
    });
    
    $("#aggiungifull").click(function () {
        var o = new Nominativo($("#completo").val())
        $('#dialog_title').val(o.title);
        $('#dialog_cognome').val(o.cognome);
        $('#dialog_nome').val(o.nome);
        $('#dialog_telefono').val(o.telefono);
        $('#save').off('click');
        $('#save').click(function () {
            o.title = $('#dialog_title').val()
            o.cognome = $('#dialog_cognome').val()
            o.nome = $('#dialog_nome').val()
            o.telefono = $('#dialog_telefono').val()
            ctlRubrica.create(o, function (m) {
                addRow(o);
            });
            $('#staticBackdrop').modal('hide');
            $("#completo").val("")
        });
        $('#dialog_id').text("");
        $('#staticBackdropLabel').text("Aggiungi")
        $('#staticBackdrop').modal('show');
    })
    $("#aggiungi").click(function () {
        var nomin = new Nominativo($("#completo").val())
        if (nomin.cognome == "") {
            alert("Specificare almeno il cognome");
            $("#completo").focus();
            return;
        }
        ctlRubrica.create(nomin, function (m) {
            addRow(nomin)
        });
        $("#completo").val("")
    })
});
function addRow(o) {
    var row = $(templateRiga);
    row.find("#id").text(o.id);
    row.find("#title").text(o.title);
    row.find("#surname").text(o.cognome);
    row.find("#name").text(o.nome);
    row.find("#phone").text(o.telefono);
    row.find("#modify").click(function () {
        var a = $(this).parentsUntil("tbody");
        var tr = a[a.length - 1];
        $('#dialog_id').text(parseInt($(tr).find("#id").text()))
        $('#dialog_title').val($(tr).find("#title").text());
        $('#dialog_cognome').val($(tr).find("#surname").text());
        $('#dialog_nome').val($(tr).find("#name").text());
        $('#dialog_telefono').val($(tr).find("#phone").text());
        $('#save').off('click');
        $('#save').click(function () {
            console.log(tr)
            var o = new Nominativo($('#dialog_cognome').val(), $('#dialog_nome').val(), $('#dialog_telefono').val())
            o.id = $('#dialog_id').text()
            o.title = $('#dialog_title').val()
            $(tr).find("#title").text(o.title)
            $(tr).find("#surname").text(o.cognome)
            $(tr).find("#name").text(o.nome)
            $(tr).find("#phone").text(o.telefono)
            ctlRubrica.update(o);
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
        ctlRubrica.delete(parseInt($(tr).find("#id").text()))
        if (!confirm("Eliminare la riga corrente?")) return;
        $(tr).remove();
    });
    $("#elenco").append(row);
}
