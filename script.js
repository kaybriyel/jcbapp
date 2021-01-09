const baseurl = 'https://jcb-report-template.herokuapp.com/';
	
	$(document).ready(function() {
      $().ready(function() {
        $sidebar = $('.sidebar');

        $sidebar_img_container = $sidebar.find('.sidebar-background');

        $full_page = $('.full-page');

        $sidebar_responsive = $('body > .navbar-collapse');

        window_width = $(window).width();

        $('.fixed-plugin a').click(function(event) {
          // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
          if ($(this).hasClass('switch-trigger')) {
            if (event.stopPropagation) {
              event.stopPropagation();
            } else if (window.event) {
              window.event.cancelBubble = true;
            }
          }
        });

        $('.fixed-plugin .active-color span').click(function() {
          $full_page_background = $('.full-page-background');

          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var new_color = $(this).data('color');

          if ($sidebar.length != 0) {
            $sidebar.attr('data-color', new_color);
          }

          if ($full_page.length != 0) {
            $full_page.attr('filter-color', new_color);
          }

          if ($sidebar_responsive.length != 0) {
            $sidebar_responsive.attr('data-color', new_color);
          }
        });

        $('.fixed-plugin .background-color .badge').click(function() {
          $(this).siblings().removeClass('active');
          $(this).addClass('active');

          var new_color = $(this).data('background-color');

          if ($sidebar.length != 0) {
            $sidebar.attr('data-background-color', new_color);
          }
        });

        $('.fixed-plugin .img-holder').click(function() {
          $full_page_background = $('.full-page-background');

          $(this).parent('li').siblings().removeClass('active');
          $(this).parent('li').addClass('active');


          var new_image = $(this).find("img").attr('src');

          if ($sidebar_img_container.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            $sidebar_img_container.fadeOut('fast', function() {
              $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
              $sidebar_img_container.fadeIn('fast');
            });
          }

          if ($full_page_background.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

            $full_page_background.fadeOut('fast', function() {
              $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
              $full_page_background.fadeIn('fast');
            });
          }

          if ($('.switch-sidebar-image input:checked').length == 0) {
            var new_image = $('.fixed-plugin li.active .img-holder').find("img").attr('src');
            var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');

            $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
            $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
          }

          if ($sidebar_responsive.length != 0) {
            $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
          }
        });

        $('.switch-sidebar-image input').change(function() {
          $full_page_background = $('.full-page-background');

          $input = $(this);

          if ($input.is(':checked')) {
            if ($sidebar_img_container.length != 0) {
              $sidebar_img_container.fadeIn('fast');
              $sidebar.attr('data-image', '#');
            }

            if ($full_page_background.length != 0) {
              $full_page_background.fadeIn('fast');
              $full_page.attr('data-image', '#');
            }

            background_image = true;
          } else {
            if ($sidebar_img_container.length != 0) {
              $sidebar.removeAttr('data-image');
              $sidebar_img_container.fadeOut('fast');
            }

            if ($full_page_background.length != 0) {
              $full_page.removeAttr('data-image', '#');
              $full_page_background.fadeOut('fast');
            }

            background_image = false;
          }
        });

        $('.switch-sidebar-mini input').change(function() {
          $body = $('body');

          $input = $(this);

          if (md.misc.sidebar_mini_active == true) {
            $('body').removeClass('sidebar-mini');
            md.misc.sidebar_mini_active = false;

            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();

          } else {

            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar('destroy');

            setTimeout(function() {
              $('body').addClass('sidebar-mini');

              md.misc.sidebar_mini_active = true;
            }, 300);
          }

          // we simulate the window Resize so the charts will get updated in realtime.
          var simulateWindowResize = setInterval(function() {
            window.dispatchEvent(new Event('resize'));
          }, 180);

          // we stop the simulation of Window Resize after the animations are completed
          setTimeout(function() {
            clearInterval(simulateWindowResize);
          }, 1000);

        });
      });
	  
	  // $('#signin').click(signin);
	  $('#signform div.d-none input').removeAttr('required');
	  
	  $('#signup').click(function() {
		  $('#signform div.d-none').toggleClass('d-none');
		  $('#submitsignup').toggleClass('d-none');
		  $(this).toggleClass('d-none');
	  });
	  $('#submitsignup').click(signup);
    });
	
function post(router, id, data, end) {
    data.id = id;
    const req = $.post((baseurl + router), data, function () {
        alert('success');
    }).fail(function() {
		if(req.status == 500) {
			alert('Already signed up');
		} else alert('fail');
	}).always(end);
}

function del(id) {
    $.ajax({
        method: 'DELETE',
        url: baseurl + 'staff/' + id,
        success: function () {
            alert('success');
        },
        error: function () {
            alert('error');
        }
    });
}

function signin() {
	const name = $('#uname').val().toLowerCase();
	const pwd = $('#pwd').val().toLowerCase();

	if(!checkValidation()) return;
	
	const spinner = $(this).children('span');
	spinner.toggleClass('spinner-border');
	
	const id = name + pwd;
	const url = baseurl + 'staff/';
	$.get(url+id, function(data, status) {
		$('#role'+data.role).click();
		$('#signform').submit();
	}).fail(function(){
		alert('fail');
	}).always(function() {
		spinner.toggleClass('spinner-border');
	});
}

function signup() {
	const uname = $('#uname').val().toLowerCase();
	const name = $('#name').val();
	const pwd = $('#pwd').val().toLowerCase();
	const cpwd = $('#cpwd').val().toLowerCase();
	const role = $('input:checked').val();
	const id = (uname + pwd).replace(/ /g, '');

	if(!checkValidation('signup')) return;
	
	if(pwd != cpwd) {
		$('#matchpwd').removeClass('d-none');
		return;
	} else $('#matchpwd').addClass('d-none');
	
	const spinner = $(this).children('span');
	spinner.toggleClass('spinner-border');
	
	post('staff', id, {name, uname, pwd, role}, function(){
		spinner.toggleClass('spinner-border')
	});
}

function checkValidation(e) {
	let valid = true;
	
	let input = $('#uname, #pwd');
	if(e == 'signup') {
		if(!$('#roleseller, #rolestockclerk').is(":checked")) {
			valid = false;
			$('#roleseller, #rolestockclerk').parent().addClass('text-danger');
		} else {
			$('#roleseller, #rolestockclerk').parent().removeClass('text-danger');
		}
		input = $('#uname, #pwd, #cpwd, #name');
	}
	
	$(input).each((idx, i) => {
		const l = $(i).siblings('label');
		if($(i).val() == '') {
			valid = false;
			if(!$(l).attr('class').includes('text-danger')) {
				$(l).toggleClass('text-danger');
				$(l).text('Require ' + $(l).text());
			}
		} else {
			if($(l).attr('class').includes('text-danger')) {
				$(l).toggleClass('text-danger');
				$(l).text($(l).text().replace('Require ', ''));
			}
		}
	});
	
	return valid;
}