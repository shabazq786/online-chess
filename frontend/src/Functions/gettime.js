
export function gettime (time1) {
  const now = new Date();
  const time2 = Math.round(now.getTime() / 1000);
  let diff_time = time2 - time1;
  let result = "";

  switch (true) {
    case diff_time < 60:
      result = (diff_time)
      if (result <= 1) {
        result = String(result) + " second ago";
      }
      else {
        result = String(result) +  " seconds ago";
      }    
      break;
    case diff_time >= 60 && diff_time < 3600:
      result = Math.floor(diff_time / 60)
      if (result <= 1) {
        result = String(result) + " minute ago";
      }
      else {
        result = String(result) +  " minutes ago";
      }   
      break;
    case diff_time >= 3600 && diff_time < 86400:
      result = Math.floor(diff_time / 3600)
      if (result <= 1) {
        result = String(result) + " hour ago";
      }
      else {
        result = String(result) +  " hours ago";
      }   
      break;
    case diff_time >= 86400 && diff_time < 2592000:
      result = Math.floor(diff_time / 86400)
      if (result <= 1) {
        result = String(result) + " day ago";
      }
      else {
        result = String(result) +  " days ago";
      }   
      break;
    case diff_time >= 2592000 && diff_time < 31104000:
      result = Math.floor(diff_time / 2592000)
      if (result <= 1) {
        result = String(result) + " month ago";
      }
      else {
        result = String(result) +  " months ago";
      }   
      break;
    case diff_time >= 31104000:
      result = Math.floor(diff_time / 31104000)
      if (result <= 1) {
        result = String(result) + " year ago";
      }
      else {
        result = String(result) +  " years ago";
      }   
      break;
    default:
      result = "";
      break; 
  }
  return result;
}