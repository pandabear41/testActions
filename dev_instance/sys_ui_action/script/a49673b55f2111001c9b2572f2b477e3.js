function openNewService() {
	var attr = 'showSelect:false,startNewItem:true,omitPrice:true,startType:"sc_cat_item_producer_service",showSaveAndClose:true,targetCategory:"' + g_form.getValue("category") + '",targetTable:"' + g_scratchpad.table_name + '"';
	if (typeof g_scratchpad.catalog != "undefined")
		attr += ',targetCatalog:"' + g_scratchpad.catalog + '"';

	var url = new GlideURL('$ng_fd_sc.do');
	url.addParam('sysparm_stack', 'no');
	url.addParam('sysparm_attributes', attr);
	var w = getTopWindow();
	w.open(url.getURL(), '_blank').focus();
	if (w.closedFD)
		delete w.closedFD;

	w.closedFD = function() {
		var listObj = GlideList2.get('catalog_category_request.REL:340d83b25f2111001c9b2572f2b4773d');
		if (listObj) {
			listObj.refresh();
			g_form.showRelatedList('REL:340d83b25f2111001c9b2572f2b4773d');
		}
		listObj = GlideList2.get('catalog_category_request.REL:e92f14225f2111001c9b2572f2b47730');
		if (listObj) {
			listObj.refresh();
			g_form.showRelatedList('REL:e92f14225f2111001c9b2572f2b47730');
		}
	};
}