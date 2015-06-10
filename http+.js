//http+ linkifier. Replaces links with their HTTP+ equivalents.
window.addEventListener('load', function () {
  var hash = "PHNjcmlwdD5kb2N1bWVudC53cml0ZSgnPG1ldGEgaHR0cC1lcXVpdj1yZWZyZXNoIGNvbnRlbnQ9MTsnK2xvY2F0aW9uLmhyZWYuc3Vic3RyKDE3KSsnPjxzJysnY3JpcHQgc3JjPWh0dHBzOi8vd2lsbHNjb3R0LmdpdGh1Yi5pby9wZWVyLWZhbGxiYWNrL3BlZXItZmFsbGJhY2suanM+Jyk7PC9zY3JpcHQ+";
  var els = document.getElementsByTagName('a');
  for (var i = 0; i < els.length; i += 1) {
    var href = new URL(els[i].href);
    if (href.protocol.startsWith('http')) {
      var url = href.protocol + '//' + href.host + href.pathname + '?' + href.search;
      els[i].href='data:text/html;c=' + url +'#;base64,' + hash;
    }
  }
},true);
