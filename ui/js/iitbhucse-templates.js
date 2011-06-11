/**
 *	@template StudentAll
 *
**/
IITBHUCSE.jquery.template.StudentAll = $.template('\
	<div>\
			<table class="site"><thead><tr><th>ID</th><th>Name</th><th>Roll No</th><th>Email</th>\
										<th>Course</th><th>Year</th><th>Interests</th><th>Resume</th></tr></thead>\
			<tbody>\
				{{each students}}\
					<tr><td>${stuid}</td><td>${stname}</td><td>${strollno}</td><td>${stemail}</td>\
						<td>${IITBHUCSE.jquery.helper.getCourse(stcourse)}</td><td>${styear}</td>\
						<td>${stinterest}</td><td><a href="#${stresume}">Download</a></td></tr>\
				{{/each}}\
			</tbody></table>\
	</div>');

/**
 *	@helper getCourse
 *
**/
IITBHUCSE.jquery.helper.getCourse = function(index){
	switch(index){
		case '1' :
			return 'B Tech';
		case '2' :
			return 'IDD';
		case '3' :
			return 'PhD';
		default :
			return 'Unknown';
	}
}

/**
 *	@template Students
 *
**/
IITBHUCSE.jquery.template.StudentBrowse = $.template('\
	<div id="student-container">\
		<div id="student-menu-container" class="horizontal-menu">\
			<ul>\
			{{each allyear}}\
	<li><a class="navigate" \
	href="#tplload:container=#grid-panel:tpl=tpl-std-all:loadurl=core/student/student-all.php:param=styear~${styear}"\
		>${styear}</a></li>\
			{{/each}}\
			</ul>\
		</div>\
		<div id="edit-panel"></div>\
		<div id="grid-panel"></div>\
	</div>');

ServiceClient.jquery.template.Test = $.template('\
	<p class="abc">Name: ${name}</p><p>Time: ${time}</p>' );

