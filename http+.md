Hacking Data-Scheme URLs
========================

(Data URLs)[https://en.wikipedia.org/wiki/Data_URI_scheme], allow for embedding
content within another resource. One side effect of this ability is that data
URLs can be used as a sharable link with more capabilities than a typical 'http'
or 'https' scheme.

We've seen several uses of URLs over the last years to extend their
functionality, like the use of the 'anchor' (the '#' sign) to accompany a URL
with local data that is never sent to the server, but can be used as an
in-browser capability.

Here we look at whether a data URL can be used to reasonably extend a URL to
run scripts in the exceptional case where the server itself is unavailable.


HTTP+ URLs
----------

We introduce `HTTP+` URLs of the following scheme:
```
data:http+;www.google.com/;base64,PHNjcmlwdD5sPXdpbmRvdy5sb2NhdGlvbix1PSdodHRwczovLycrbC5ocmVmLnNwbGl0KCc7JylbMV07ZG9jdW1lbnQud3JpdGUoJzxpbWcgc3JjPVwnJyt1KydcJyBvbmxvYWQ9bC5ocmVmPXUgb25lcnJvcj1sLmhyZWY9dT48cycrJ2NyaXB0IHNyYz1odHRwczovL3dpbGxzY290dC5naXRodWIuaW8vcGVlci1mYWxsYmFjay9wZWVyLWZhbGxiYWNrLmpzPicpOzwvc2NyaXB0Pg==
```

This is a resilient URL for `https://www.google.com/`. More generally, `HTTP+`
URLs are of the form:
```
data:http+;<URL>;base64,PHNjcmlwdD5sPXdpbmRvdy5sb2NhdGlvbix1PSdodHRwczovLycrbC5ocmVmLnNwbGl0KCc7JylbMV07ZG9jdW1lbnQud3JpdGUoJzxpbWcgc3JjPVwnJyt1KydcJyBvbmxvYWQ9bC5ocmVmPXUgb25lcnJvcj1sLmhyZWY9dT48cycrJ2NyaXB0IHNyYz1odHRwczovL3dpbGxzY290dC5naXRodWIuaW8vcGVlci1mYWxsYmFjay9wZWVyLWZhbGxiYWNrLmpzPicpOzwvc2NyaXB0Pg==
```

These are actually base64-encoded `data` URLs, with two deviations from the
standard which appear largely tolerated by browsers. `http+`
is misused as the mime-type for the URL to signal the purpose of the resource.
The canonical url is replaces the `charset` field for the Data URL to provide
readability and user insight into the URL. Invalid charsets are
ignored by most browsers. The resulting URLs a generally recognized correctly by
browsers and bare substantial resemblance to the original URL.


Building 
--------

What is the base64 data in the above URLs, and what does it do?

Our first priority is to see if server is available, and use the canonical URL
if possible. We do so with the following code:
```javascript
var l = location;
var d = /;(([^/;]*)[^;]*)/.exec(l.href); // regex matching the Canonical URL and domain.
var u = 'https://' + d[1]; // The Canonical URL.
var f = 'https://' + d[2] + '/favicon.ico'; // The Favicon.
document.write("<img src='" + f + "' onload='l.href=u'>");
```

This attempts to load the 'favicon.ico' resource from the server, and on success
directs the browser to the canonical URL.

Secondly, we want to attempt alternative mechanisms for loading the URL based
on the current network conditions. For this, we will attempt to load a static
script which is widely available and hopefully cached on the user's machine.
This would be done through the following process:
```javascript
document.write("<s'+'cript src='library_URL'>");
```

Given desired javascript code, we can construct the http+ URL as follows:
```javascript
var script = "<script>CODE_TO_RUN</script>";
var data = new Buffer(script).toString('base64');
console.log('data:http+;CANONICAL_URL;base64,' + data);
```

Development
-----------

The Development hash does not provide availability, since it uses a unique domain,
which can be disrupted without collateral damage. However, it allows for
low-hassle iteration on the fallback script:

A payload of:
```javascript
h='https://',l=location,u=/;(([^/;]*)[^;]*)/.exec(l.href);document.write('<img src='+h+u[2]+'/favicon.ico onload=\\'l.href=h+u[1]\\'><s'+'cript src='+h+'willscott.github.io/peer-fallback/peer-fallback.js>');
```

Produces the following HTTP+ URL:
```
data:http+;URL;base64,PHNjcmlwdD5oPSdodHRwczovLycsbD1sb2NhdGlvbix1PS87KChbXi87XSopW147XSopLy5leGVjKGwuaHJlZik7ZG9jdW1lbnQud3JpdGUoJzxpbWcgc3JjPScraCt1WzJdKycvZmF2aWNvbi5pY28gb25sb2FkPVwnbC5ocmVmPWgrdVsxXVwnPjxzJysnY3JpcHQgc3JjPScraCsnd2lsbHNjb3R0LmdpdGh1Yi5pby9wZWVyLWZhbGxiYWNrL3BlZXItZmFsbGJhY2suanM+Jyk7PC9zY3JpcHQ+
```

