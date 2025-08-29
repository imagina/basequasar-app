class Modal {  
  load(CKEDITOR) {
		
		const lang =  { 			
			title : 'Title',
			content: 'Content',
			content : 'Enter text or code snippet...',
			dialogTitle: 'Collapsible item',
			button: 'Insert collapsible snippet',
			color : 'Background',
			colorDefault : 'Default',
			colorGray : 'Gray',
			colorBlack : 'Black',
			maxheight : 'Max height',
			maxheightDefault : 'Unconstrained',
			hidesummary: 'Hide title',
			collapse: 'Collapsed',
			monospace: 'Monospace font',
			wrap: 'Autowrap long lines',
			bordered: 'Bordered',
			cssclass: 'CSS classes'		
	};	

CKEDITOR.dialog.add('collapsibleItem', function( editor ) {	
	return {
		title: lang.dialogTitle,
		minWidth: 300,
		minHeight: 100,
		contents: [
		{
			id: 'info',
			label: lang.tab,
			elements: [
			{
				id: 'title',
				type: 'text',
				label: lang.title,
				setup: function( widget ) {
					this.setValue( widget.data.title );
				},
				commit: function( widget ) {
					widget.setData( 'title', this.getValue() );
				}
			},
			/*
			{
				type: 'hbox',
				widths: ['90%', '10%'],
				children: [
					{
					type: 'vbox',					
					children: [					
						{
							id: 'collapse',
							type: 'checkbox',
							label: lang.collapse,
							setup: function( widget ) {
								this.setValue( widget.data.collapse );
							},
							commit: function( widget ) {
								widget.setData( 'collapse', this.getValue()?'true':'' );
							}
						},
					]
				}]
			}*/
			]
		}]
	}
})
	}
}

//Export
const modal = new Modal();
export default modal;
export { modal };