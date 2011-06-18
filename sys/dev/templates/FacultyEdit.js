/**
 *	@template FacultyEdit
 *
**/
IITBHUCSE.jquery.template.FacultyEdit = $.template('\
	<div id="admin-fac-panel">\
		<div id="faculty-options-container" class="horizontal-menu"><fieldset>\
			<legend>Faculty #${faculty.fid} Options</legend>\
			<ul>\
				<li><a href="#tplload:cntr=#edit-panel:url=core/admin/faculty.php:arg=do~rem&fid~${faculty.fid}" \
				class="navigate" >Delete</a></li>\
			</ul>\
		</fieldset></div>\
		<div id="faculty-edit-container" class="horizontal-menu form-panel">\
		<form action="core/admin/faculty.php" method="post" class="navigate" \
				id="_formsubmit:sel._admin-fac-panel">\
			<fieldset >\
				<legend>Edit Faculty #${faculty.fid} Credentials</legend>\
				<input type="hidden" name="do" value="edit"/>\
				<input type="hidden" name="fid" value="${faculty.fid}"/>\
				<label>Email\
					<input type="text" name="femail" value="${faculty.femail}" disabled="disabled"/>\
				</label>\
				<label>Name\
					<input type="text" name="fname" value="${faculty.fname}"/>\
				</label>\
				<label>Designation\
				<select name="fdesignation" >\
						<option value="1" {{if ServiceClient.jquery.helper.equals(faculty.fdesignation, 1)}}selected="selected"{{/if}}>Professor</option>\
						<option value="2" {{if ServiceClient.jquery.helper.equals(faculty.fdesignation, 2)}}selected="selected"{{/if}}>Assist. Professor</option>\
						<option value="3" {{if ServiceClient.jquery.helper.equals(faculty.fdesignation, 3)}}selected="selected"{{/if}}>Reader</option>\
						<option value="4" {{if ServiceClient.jquery.helper.equals(faculty.fdesignation, 4)}}selected="selected"{{/if}}>Lecturer</option>\
					</select>\
				</label>\
				<label>Qualification\
					<input type="text" name="fqualification" class="field" value="${faculty.fqualification}"/>\
				</label>\
				<label>Phone No\
					<input type="text" name="fphone" class="field" value="${faculty.fphone}" />\
				</label>\
				<label>Status\
				<select name="fstatus">\
				<option value="1" {{if ServiceClient.jquery.helper.equals(faculty.fstatus, 1)}}selected="selected"{{/if}}>Teaching</option>\
				<option value="2" {{if ServiceClient.jquery.helper.equals(faculty.fstatus, 2)}}selected="selected"{{/if}}>Retired</option>\
				</select>\
				</label>\
				<label>Interests\
					<textarea name="finterest" rows="3" class="field">${faculty.finterest}</textarea>\
				</label>\
				<input name="submit" type="submit" value="Submit" />\
				<input name="reset" type="reset" value="Reset" />\
				<div class="status"></div>\
			</fieldset>\
		</form>\
	</div>\
</div>');

