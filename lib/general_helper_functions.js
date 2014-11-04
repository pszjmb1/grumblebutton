/**
 * Some general helpers
 */

/**
 * Date difference
 * Receives a date and time, and returns a string with the number of days since that time.
 */

getDaysSince = function(aDate, aTime){
  if(!aDate || undefined == aDate){
    return "unknown."
  }
  var millisInDay=1000*60*60*24; //milliseconds to day
  var diff;
  if(!aTime || undefined == aTime){
    console.log(aDate);
    diff = Math.abs(new Date() - new Date((aDate).replace(/-/g,'/')));
  }else{
    diff = Math.abs(new Date() - new Date((aDate+" " + aTime).replace(/-/g,'/')));
  }
  diff = Math.floor(diff / millisInDay);
  if(1.01 >= diff){
    return "today."
  } else if(2.01 >= diff){
    return "yesterday."
  } else{
    return diff + " days ago."
  }
}