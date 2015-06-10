//http+ linkifier. Replaces links with their HTTP+ equivalents.
window.addEventListener('load', function () {
  var hash = "PHNjcmlwdD5sPWxvY2F0aW9uLHU9J2h0dHBzOi8vJytsLmhyZWYuc3BsaXQoJzsnKVsxXTtkb2N1bWVudC53cml0ZSgnPGlmcmFtZSBzcmM9Jyt1Kycgb25sb2FkPVwnbC5ocmVmPXVcJy8+PHMnKydjcmlwdCBzcmM9aHR0cHM6Ly93aWxsc2NvdHQuZ2l0aHViLmlvL3BlZXItZmFsbGJhY2svcGVlci1mYWxsYmFjay5qcz4nKTs8L3NjcmlwdD4=";
  var els = document.getElementsByTagName('a');
  for (var i = 0; i < els.length; i += 1) {
    var href = new URL(els[i].href);
    if (href.protocol.startsWith('http')) {
      var url = href.host + href.pathname + '?' + href.search;
      els[i].href='data:text/html;' + url +';base64,' + hash;
    }
  }
},true);
