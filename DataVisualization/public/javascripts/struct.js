/**
 * Created by JAY on 2016. 7. 14..
 */

$("#btnREST").click(function(){

    document.getElementById('jsonChart').innerHTML = "";

    var url = $('#inputUrl').val();

    var data = getData(url, form_data);

    var ppTable = prettyPrint(data);

    document.getElementById('jsonChart').appendChild(ppTable);
});
