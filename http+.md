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
data:text/html;c=https://www.google.com/#;base64,PHNjcmlwdD5sPXdpbmRvdy5sb2NhdGlvbix1PSdodHRwczovLycrbC5ocmVmLnNwbGl0KCc7JylbMV07ZG9jdW1lbnQud3JpdGUoJzxpbWcgc3JjPVwnJyt1KydcJyBvbmxvYWQ9bC5ocmVmPXUgb25lcnJvcj1sLmhyZWY9dT48cycrJ2NyaXB0IHNyYz1odHRwczovL3dpbGxzY290dC5naXRodWIuaW8vcGVlci1mYWxsYmFjay9wZWVyLWZhbGxiYWNrLmpzPicpOzwvc2NyaXB0Pg==
```

This is a resilient URL for `https://www.google.com/`. More generally, `HTTP+`
URLs are of the form:
```
data:text/html;c=<URL>#;base64,PHNjcmlwdD5sPXdpbmRvdy5sb2NhdGlvbix1PSdodHRwczovLycrbC5ocmVmLnNwbGl0KCc7JylbMV07ZG9jdW1lbnQud3JpdGUoJzxpbWcgc3JjPVwnJyt1KydcJyBvbmxvYWQ9bC5ocmVmPXUgb25lcnJvcj1sLmhyZWY9dT48cycrJ2NyaXB0IHNyYz1odHRwczovL3dpbGxzY290dC5naXRodWIuaW8vcGVlci1mYWxsYmFjay9wZWVyLWZhbGxiYWNrLmpzPicpOzwvc2NyaXB0Pg==
```

These are actually base64-encoded `data` URLs, which deviate only slightly from
the standard and which appear largely tolerated by browsers. 
The canonical url replaces the `charset` field for Data URLs with a special `c`
attribute standing for `canonical`. The embedded URL is parsable by most email
or link shortening services, with the extranious data inserted in the anchor.
Invalid Charsets appear to be ignored, so the full data URL loads normally
when visited. The embedded canonical URL is also easily extractable and tagged
so it can be handled appropriately by both browsers and end users.


Building 
--------

What is the base64 data in the above URLs, and what does it do?

Our first priority is to see if server is available, and use the canonical URL
if possible. There are several mechanisms that can be used to figure this out
in a small number of bytes.

 * Meta refresh or JS redirect to the URL.
 * load URL in iFrame and see if `onload` handler is called.
 * Load favicon for domain in an image and see if `onload` handler is called.

For the moment we use the iFrame method:
```javascript
var l = location;
var u = l.href.split(';')[1]; // The Canonical URL.
document.write("<iframe src='" + u + "' onload='l.href=u'>");
```

Secondly, we want to attempt alternative mechanisms for loading the URL based
on the current network conditions. For this, we attempt to load a static
script which is widely available and hopefully cached on the user's machine.
(ideally we can come up with a standard that allows browsers to recognize this
form of URL and have the contents of such a library preloaded.)
This would can be done through the following process:
```javascript
document.write("<s'+'cript src='library_URL'>");
```

With a payload, the constructed http+ URL can be build with node as:
```javascript
var script = "<script>CODE_TO_RUN</script>";
var data = new Buffer(script).toString('base64');
console.log('data:text/html;c=CANONICAL_URL#;base64,' + data);
```

Development
-----------

This hash does not provide availability, since it uses an un-cached and easily
identifiable script. However, it allows for low-hassle iteration on the
fallback script:


A payload of:
```javascript
document.write('<meta http-equiv=refresh content=1;'+location.href.substr(17)+'><s'+'cript src=https://willscott.github.io/peer-fallback/peer-fallback.js>');
```


Produces the following HTTP+ URL:
```
data:text/html;c=CANONICAL_URL#;base64,PHNjcmlwdD5kb2N1bWVudC53cml0ZSgnPG1ldGEgaHR0cC1lcXVpdj1yZWZyZXNoIGNvbnRlbnQ9MTsnK2xvY2F0aW9uLmhyZWYuc3Vic3RyKDE3KSsnPjxzJysnY3JpcHQgc3JjPWh0dHBzOi8vd2lsbHNjb3R0LmdpdGh1Yi5pby9wZWVyLWZhbGxiYWNrL3BlZXItZmFsbGJhY2suanM+Jyk7PC9zY3JpcHQ+
```


Other payloads:
----

* iFrame based:
```javascript
l=location,u=l.href.split(';')[1];document.write('<iframe src='+u+' onload=\\'l.href=u\\'/><s'+'cript src=https://willscott.github.io/peer-fallback/peer-fallback.js>');
```
