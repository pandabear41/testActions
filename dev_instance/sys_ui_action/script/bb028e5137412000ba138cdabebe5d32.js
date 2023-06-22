function showLiveFeedList() {
   var sysId = g_sysId;
   var box = GlideBox.get('showLiveFeed_' + sysId);
   if (box) 
	  box.close(0);

   var table = g_list.getTableName();
   showPopupLiveFeedList(sysId, table);
}