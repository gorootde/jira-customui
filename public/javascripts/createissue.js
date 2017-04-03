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


function refreshIssueTypes(projectKey){

  $('.issuetype').attr('disabled','disabled');
  $('.issuetype[data-projectkey="'+projectKey+'"]').attr('disabled',null);
  $('#selissuetype').selectpicker('refresh');
}

$(document).ready(function(){
  $('.selectpicker').selectpicker({
    style: 'btn-info',
    size: 8
  });

  refreshIssueTypes($('#selproject').val());

  $('#selproject').change(function(){
      var projectKey=$(this).val();
      refreshIssueTypes(projectKey);
  });
});

