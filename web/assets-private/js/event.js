$(document).on('click', 'body', function(e) {
    var tc = sessionStorage.getItem('topClick');
    var a_idx = parseInt(tc) || 1;

    var $i = $("<span/>").text('+'+a_idx+++'♥');
    var x = e.pageX,
        y = e.pageY;
    $i.css({
        "z-index": 1001,
        "top": y - 20,
        "left": x,
        "position": "absolute",
        "font-weight": "bold",
        "color": "#ff6651"
    });
    $("body").append($i);
    $i.animate({
            "top": y - 180,
            "opacity": 0
        },
        1500,
        function() {
            $i.remove();
        });
    sessionStorage.setItem('topClick', a_idx);
});

$(document).on('click', 'li.disabled a', function (e) {
    e.preventDefault();
});

$(document).on('click', 'nav.navbar-static-top a', function (e) {
    if ($(this).attr('href') !== '#' && $(this).attr('href') !== '/logout') {
        e.preventDefault();
        go($(this).attr('href'));

        $('#navbar-collapse').collapse('hide');
        $('#navbar-collapse-user').collapse('hide')
    }
});

$(document).on('click', '.set-locale-link', function (e) {
    e.preventDefault();
    var locale = $(this).attr('data-locale');

    $.post(window.vmoex.links.G_set_locale_link, {locale:locale}, function (data) {
        if (data.ret) {
            success(data.msg);
            window.location.reload();
        } else {
            error(data.msg);
        }
    });
});

$(document).on('click', '.dropdown-notifications a', function () {
    var $label = $('.notification-label');
    var text = $label.attr('data-origin');
    $label.text(text);
});

$(document).on('submit', '#site-search', function (e) {
    e.preventDefault();
    var word = $('#search-content').val();
    if (word.length === 0) {
        error('搜索内容不能为空');
        return ;
    }

    go('/search?s='+word);

    $('#navbar-collapse').collapse('hide');
    $('#navbar-collapse-user').collapse('hide');
});

$(document).on('click', '.thumb-up', function () {
    var $this = $(this);
    $.ajax({
        method:  'POST',
        url: window.vmoex.links.G_thumb_up__link,
        data: {
            cid: $this.attr('data-cid')
        },
        success: function (data) {
            if (data.ret) {
                var count = $this.find('.thumb-count').text();
                if (count === window.vmoex.trans.thumbup) {
                    count = 0;
                }
                count = parseInt(count ? count : 0);
                var res = data.info ? count+1 : count-1;
                $this.find('.thumb-count').text(res);

                if (data.info) {
                    $this.find('i.fa').removeClass('fa-thumbs-o-up').addClass('fa-thumbs-up').addClass('text-success');
                } else {
                    $this.find('i.fa').removeClass('fa-thumbs-up').addClass('fa-thumbs-o-up').removeClass('text-success');
                }
            } else {
                error(data.msg);
            }
        }
    })
});

$(document).on('click', '#addCommentToPost', function () {
    var $this = $(this);

    if ($this.hasClass('disabled')) {
        warning(window.vmoex.trans.action_too_quick);
        return ;
    }

    var postId = $this.attr('data-postId');

    $this.addClass('disabled');
    var content = editor.$txt.html();
    $.ajax({
        method: 'POST',
        url: path(window.vmoex.links.add_comment_to_post, {1: postId}),
        data: {
            content: content
        },
        success: function (data) {
            if (data.ret) {
                reload();
            } else {
                error(data.msg);
                $this.removeClass('disabled');
            }

        }
    })
});

$(document).on('keydown', '.chat-panel input#btn-input', function (e) {
    if (e.keyCode === 13) {
        $('#sendChat').trigger('click');
    }
});

$(document).on('click', '#sendChat', function () {
    $.ajax({
        method: 'POST',
        url: window.vmoex.links.send_chat,
        data: {content: $('#btn-input').val()},
        success: function (data) {
            data.ret ? reload() : error(data.msg);
        }
    })
});

$(document).on('click', '#refresh-chat', function () {
    reload();
});

$(document).on('click', '#sign-remark', function () {
    $.ajax({
        method: 'POST',
        url: window.vmoex.links.G_sign_link,
        success: function (data) {
            if (data.ret) {
                success(data.msg);
                reload();
            } else {
                warning(data.msg);
            }
        }
    })
});

$(document).on('click', '.comment-reply', function () {
    var replyTo = $(this).attr('data-at');
    var replayU = $(this).attr('data-atu');
    window.location.href = '#comment-box';
    $('#editor-comment p:last-child').append('<span data-at="'+replayU+'">@'+replyTo + "</span>&nbsp;");
    $('#editor-comment').focus();
    setEndOfContenteditable(document.getElementById('editor-comment'));
});

$(document).on('keydown', '#editor-comment', function (e) {
    var $this = $(this);
    if (e.keyCode === 13) {
        $this.height($this.height()+$this.scrollTop()+18);
    }
});

$(document).on('click', 'nav .nav-search-bar span', function () {
    $('#site-search').trigger('submit');
});

$(window).scroll(function() {
    if ($(this).scrollTop() > 200) {
        $('.go-top').fadeIn(200);
    } else {
        $('.go-top').fadeOut(200);
    }
});

$('.go-top').click(function(event) {
    event.preventDefault();
    $('html, body').animate({scrollTop: 0}, 300);
});