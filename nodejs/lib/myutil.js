/* 
    myutil.js
    */ 
/*
 * flavorize - Changes JSON based on flavor in configuration 
 */
module.exports.formate_date = function(date, format) {
  date = date || new Date(); 
  return date.getFullYear() +"-"+ pad(date.getMonth()+1, 2) +"-"+ pad(date.getDate(), 2)+" "+ pad(date.getHours(), 2) +":"+ pad(date.getMinutes(),2)+":" + pad(date.getSeconds(), 2)
};
pad = function(val, digits){
  val =val+ "";
  if(val.length  >=digits) return val
  var l = val.length;
  for(var i=0;i< digits- l;i++)
    val = "0"+val;
  return val
}


module.exports.exception = function(msg, type, data){
  return {
    error:msg,
    type:type || 'Runtime',
    data:data
  }
}

