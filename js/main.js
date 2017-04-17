var options = {
    valueNames: [ 'spaces-title', 'spaces-location','spaces-type','spaces-times',{name: 'spaces-speed', attr: 'data-speed'}, 'spaces-password' ]
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
