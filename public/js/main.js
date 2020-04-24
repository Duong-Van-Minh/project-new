$(function (){

	if($('textarea#content').length){
		CKEDITOR.replace( 'content' );
	} 
	$('a.confirm').on('click',function(){
		if (!confirm('your want deletion')) return false;
	})

	if($("[data-fancybox]").length) {
		$("[data-fancybox]").fancybox();
	}

})