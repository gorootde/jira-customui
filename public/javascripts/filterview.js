//
//     Copyright (C) 2017  Michael Kolb
//
//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <http://www.gnu.org/licenses/>.

$(document).ready(function() {
    var table = $('#issuelist').DataTable({
        colReorder: true
    });
    $('.toggle-vis').change(function(e){
      e.preventDefault();
      var colname=$(this).data('column');
      var column = table.column($('#issuelist th[data-column="'+colname+'"]'));
      console.log(column);
      column.visible(!column.visible());
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
            $.get(detailsurl).done(function(details){
              row.child(details).show();
              tr.addClass('shown');
            });


        }
    });
});
