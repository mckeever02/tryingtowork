/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function() {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  // if ('serviceWorker' in navigator &&
  //     (window.location.protocol === 'https:' || isLocalhost)) {
  //
  //       console.log('CLIENT: service worker registration in progress.');
  //   navigator.serviceWorker.register('service-worker.js').then(function() {
  //     console.log('CLIENT: service worker registration complete.');
  //   }, function() {
  //     console.log('CLIENT: service worker registration failure.');
  //
  //   });
  // }  else {
  //   console.log('CLIENT: service worker is not supported.');
  // }

  // Your custom JavaScript goes here
  var options = {
      valueNames: [ 'spaces-title', 'spaces-location','spaces-type','spaces-times',{name: 'spaces-speed', attr: 'data-speed'}, 'spaces-password',{name: 'spaces-sockets', attr: 'data-sockets'} ]
  };

  var spacesList = new List('spaces', options);

  //var clipboard = new Clipboard('.copy');

  var clipboard = new Clipboard('.copy', {
    target: function(trigger) {
        console.log(trigger.innerHTML = 'Copied');
        return trigger.previousElementSibling;
        //return document.getElementById('password')
      }
  });

  // new Clipboard('.copy', {
  //   target: function(trigger) {
  //       return trigger.closest('small');
  //     }
  // });


  clipboard.on('success', function(e, el) {
    //document.getElementById('copy').innerHTML = 'Copied';
    // console.info('Action:', e.action);
    //     console.info('Text:', e.text);
    //     console.info('Trigger:', e.trigger);
    //e.clearSelection();
    //console.log(e.trigger.innerHTML);
    var elems = document.getElementsByClassName('copy');
    for (var i=0;i<elems.length;i+=1){
      elems[i].innerHTML = 'Copy';
    }
    e.trigger.innerHTML = 'Copied'
  });

})();
