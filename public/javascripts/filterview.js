$(document).ready(function() {
    var table = $('#issuelist').DataTable({
        colReorder: true
    });
    $('#issuelist tbody').on('click', 'td.details-control', function() {
        var tr = $(this).closest('tr');
        var row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            var issue=$(tr).data('issue');
            var fields=$('#issuelist').data('fields');
            var detailsurl=window.location.pathname+"/issue/"+issue.key;
            $.get(detailsurl,{data:issue,fields:fields}).done(function(details){
              row.child(details).show();
              tr.addClass('shown');
            });


        }
    });
});