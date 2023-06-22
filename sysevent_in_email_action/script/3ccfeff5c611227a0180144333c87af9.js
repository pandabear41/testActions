//	Note: current.opened_by is already set to the first UserID that matches the From: email address

current.caller_id = gs.getUserID();
current.comments = "received from: " + email.origemail + "\n\n" + email.body_text;
current.short_description = email.subject;

current.category = "inquiry";
current.incident_state = IncidentState.NEW;
current.notify = 2;
current.contact_type = "email";

if (email.body.assign != undefined)
   current.assigned_to = email.body.assign;

if (email.importance != undefined) {
   if (email.importance.toLowerCase() == "high") {
		current.impact = 1;
		current.urgency = 1;
   }
}

if (current.canCreate())
	current.insert();