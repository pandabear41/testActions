
// Note do not use this method for authentication
// minimally read these values from the environment
var host = process.env.HOST;
var admin_user_idsid = process.env.USER_ID;
var admin_user_password = process.env.USER_PASS;

exports.MainEnv = { 
    Host: host, 
    Auth: admin_user_idsid + ':' + admin_user_password
}