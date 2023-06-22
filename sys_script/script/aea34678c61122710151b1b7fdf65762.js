function checkRequest() {
   var task = current.sysapproval.sys_class_name || current.source_table;
   return (task == 'sc_request');
}

function checkSCTask() {
   var task = current.sysapproval.sys_class_name || current.source_table;
   return (task == 'sc_task');
}

function checkStdChange() {
   var task = current.sysapproval.sys_class_name || current.source_table;
   return (task == 'std_change_proposal');
}

function getApproverUserName(approver) {
	var username = approver.getDisplayValue();
	if (!GlideDomainSupport.isDataSeparationEnabled()) 
		return username;
	if (GlideStringUtil.notNil(username))
		return username;
	return sn_fd.FlowAPI.getApproverUsername(approver.sys_id);
}

function isFlowDesigner(me) {
   if (!me.wf_activity.nil())
      return false;

   if (!me.group.nil() && (me.group.wait_for == "process_flow"))
      return true;

   var listenerGr = new GlideRecord('sys_flow_listener');
   var qc1 = listenerGr.addQuery('listening_to', me.sysapproval);
   qc1.addOrCondition('listening_to', me.document_id);
   listenerGr.addQuery('source_table', getSourceTable(me));
   listenerGr.addQuery('name', 'Ask For Approval');
   listenerGr.addQuery('state', 'WAITING');
   listenerGr.query();
   return listenerGr.hasNext();
}

var isRequest = checkRequest();
var isSCTask = checkSCTask();
var isStdChange = checkStdChange();
var isFD = isFlowDesigner(current);


if (current.state.changes() && current.state=='cancelled') {
   var event = "approval.cancelled";
   if (isRequest)
      event = "request.approval.cancelled";
   else if (isSCTask)
      event = "sc_task.approval.cancelled";
   else if (isStdChange)
      event = "std_change_proposal.approval.cancelled";

   gs.eventQueue(event, current, gs.getUserID(), gs.getUserName());
}

if (current.state.changes() && current.state=='requested') {
   var event = "approval.inserted";
   if (isRequest)
      event = "request.approval.inserted";
   else if (isSCTask)
      event = "sc_task.approval.inserted";
   else if (isStdChange)
      event = "std_change_proposal.approval.inserted";

   gs.eventQueue(event, current, gs.getUserID(), gs.getUserName());
   updateTask(current, getApproverUserName(current.approver) + " requested to approve task");
}

if (current.state.changes() && current.state=='rejected') {
   var event = "approval.rejected";
   if (isRequest)
      event = "request.approval.rejected";
   else if (isSCTask)
      event = "sc_task.approval.rejected";
   else if (isStdChange)
      event = "std_change_proposal.approval.rejected";

   gs.eventQueue(event, current, current.state, previous.state);
   var isAuto = ((current.operation() == 'insert') && isFD)?" auto":"";
   updateTask(current, getApproverUserName(current.approver) + isAuto + " rejected the task.",
         current.comments.getJournalEntry(-1));
   notifyMyFriends(current);
}

if (current.state.changes() && current.state=='approved') {
   var isAuto = ((current.operation() == 'insert') && isFD)?" auto":"";
   updateTask(current, getApproverUserName(current.approver) + isAuto + " approved the task.",
         current.comments.getJournalEntry(-1));
}

function notifyMyFriends(me) {
   var friends = new GlideRecord('sysapproval_approver');
   friends.addQuery('sysapproval', me.sysapproval);
   friends.query();
   while(friends.next()) {
      if (friends.approver.toString() != me.approver.toString()) {
         gs.eventQueue("approval.rejected.by.other", me, friends.approver);
      }
   }
}

function getSourceTable(me) {
	if (!me.source_table.nil()) {
		return me.source_table;
	}
	
	if (!me.sysapproval.nil()) {
		return me.sysapproval.getRefRecord().getTableName();
	}
	
	return null;
}

function updateTask(me, journal, comments) {
   var isWorkflow = false;
   var isProcessGuide = false;
   var tableName = "task";
   if (isFD) {
      if (gs.getProperty("com.glide.hub.flow.approval.history_comment", "true") != "true")
         return;

      if (!me.source_table.nil())
         tableName = me.source_table;
   }
   else {
      // if this is for a group approval, don't log this user action since the Group Approval Activity will handle the logging
      if (!current.group.nil())
         return;
      // only log the user approval activity for workflows when specifically turned on
      // otherwise, we spam the approval history log when it is almost never desired to track via the approval history journal field
      isWorkflow = !current.wf_activity.nil();
      if (isWorkflow && (gs.getProperty("glide.workflow.user_approval_history") != "true"))
         return;
      isProcessGuide = !current.process_step.nil();
   }
	
	if (comments)
		journal += "\n\n" + gs.getMessage("Approval comments") + ":\n" + comments;
	
	var task = new GlideRecord(tableName);
	if (task.get(me.sysapproval)) {
		if (isWorkflow || isProcessGuide)
			task.setUseEngines(false);
		
		if (!me.approval_journal_column.nil()) {
			if (typeof task[me.approval_journal_column].setJournalEntry === 'function') {
				task[me.approval_journal_column].setJournalEntry(journal);
				task.update();
				return;
			}
		}
		
		if (typeof task.approval_history.setJournalEntry === 'function') {
			task.approval_history.setJournalEntry(journal);
			task.update();
			return;
		}
	}

   // When the approval record is created by WF, the approval record itself has the parent record's sys_id
   // in 'sysapproval' field but parent record may not be available in 'task' table yet.
   if (!me.approval_journal_column.nil()) {
		if (typeof me.sysapproval[me.approval_journal_column].setJournalEntry === 'function') {
			me.sysapproval[me.approval_journal_column].setJournalEntry(journal);
			return;
		}
	}
	
	if (typeof me.sysapproval.approval_history.setJournalEntry === 'function') {
		me.sysapproval.approval_history.setJournalEntry(journal);
		return;
	}
}
