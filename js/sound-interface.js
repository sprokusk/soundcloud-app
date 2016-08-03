var SC = require('soundcloud');

SC.initialize({
  client_id: '8418c9c411768d55ad2b573b274b1de8'
});

var randomArray = [];
var random;
var findTrack = function() {
  random = (Math.floor((Math.random() * 300000000) + 10000000));
  randomArray.push(random);
  SC.get('/tracks/' + random).then(function(track){
    if (track.playback_count > 0) {
      SC.oEmbed(track.permalink_url, { auto_play: true }).then(function(result) {
        $('#widget').html(result.html);
        $('#skip-song').attr('disabled', false);
        // $('#finding').hide();
      });
      console.log(track);
    } else {
      randomArray.pop();
      findTrack();
    }
  }).catch(function(error) {
    randomArray.pop();
    findTrack();
  });
};


$(document).ready(function() {
  findTrack();
  $('#skip-song').click(function() {
    $('#widget').removeClass("twelve columns").addClass("ten columns");
    // $('#finding').show();
    $('#skip-song').attr('disabled', true);
    $('#last-songs').text("");
    for (var i = randomArray.length; i > randomArray.length - 5; i--) {
      if (randomArray[i]) {
        SC.get("/tracks/" + randomArray[i]).then(function(track) {
          if (track.artwork_url) {
            $('#last-songs').prepend('<div class="row"><a target="_blank" href="' + track.permalink_url + '"><img src="' + track.artwork_url + '" class="thumb"></a></div>');
          } else {
            $('#last-songs').prepend('<div class="row"><a target="_blank" href="' + track.permalink_url + '"><img src="' + track.user.avatar_url + '" class="thumb"></a></div>');
          }
        });
      }
    }
    findTrack();
  });
});
