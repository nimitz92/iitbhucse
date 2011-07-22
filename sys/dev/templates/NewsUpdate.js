/**
 *	@template NewsUpdate
 *
**/
IITBHUCSE.jquery.template.NewsUpdate = $.template('\
<div id="news-panel" class="panel">\
	<fieldset>\
		<legend class="headdark">Latest Updates</legend>\
		<ul class="vertical menu">\
			{{each news}}\
				<li><a class="navigate bold" \
						href="#tplload:cntr=#main-container:tpl=tpl-nws-vw:url=core/news/news-all.php:arg=newsid~${newsid}"\
						>${newstitle}<br /></a>\
						${newsdescription}\
				</li>\
			{{/each}}\
			<li><a class="navigate" \
					href="#tplload:cntr=#main-container:tpl=tpl-nws-aen:url=core/news/news-all.php:arg=all~true"\
					>See All...</a><br />\
			</li>\
		</ul>\
	</fieldset>\
</div>');
		