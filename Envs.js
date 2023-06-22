
// Note do not use this method for authentication
// minimally read these values from the environment
var admin_user_idsid = process.env.USER_ID;
var admin_user_password = process.env.USER_PASS;

exports.devInstance = { 
    Path: 'dev_instance', 
    Host: 'dev158065.service-now.com', 
    Auth: admin_user_idsid + ':' + admin_user_password
}