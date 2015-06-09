//http+ linkifier. Replaces links with their HTTP+ equivalents.
window.addEventListener('load', function () {
  var hash = "PHNjcmlwdD5oPSdodHRwczovLycsbD1sb2NhdGlvbix1PS87KChbXi87XSopW147XSopLy5leGVjKGwuaHJlZik7ZG9jdW1lbnQud3JpdGUoJzxpbWcgc3JjPScraCt1WzJdKycvZmF2aWNvbi5pY28gb25sb2FkPVwnbC5ocmVmPWgrdVsxXVwnPjxzJysnY3JpcHQgc3JjPScraCsnd2lsbHNjb3R0LmdpdGh1Yi5pby9wZWVyLWZhbGxiYWNrL3BlZXItZmFsbGJhY2suanM+Jyk7PC9zY3JpcHQ+";
  var els = document.getElementsByTagName('a');
  for (var i = 0; i < els.length; i += 1) {
    var href = new URL(els[i].href);
    if (href.protocol.startsWith('http')) {
      var url = href.host + href.pathname + '?' + href.search;
      els[i].href='data:http+;' + url +';base64,' + hash;
    }
  }
},true);
