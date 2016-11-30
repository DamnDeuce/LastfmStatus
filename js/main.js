'use strict';
$(function() {
    var $lastfmStatus = $('.lastfm-status');
    $lastfmStatus.jsLastfmStatus({
        user: 'DamnDeuce'
    });

    var $setUser = $('#setUser'),
        $userName = $('#userName');
    $setUser.on('click', function() {
        $lastfmStatus.jsLastfmStatus('setUser', $userName.val());
    })
});
