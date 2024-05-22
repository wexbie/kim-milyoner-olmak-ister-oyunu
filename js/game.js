var questions = [];
var current = 0;
var right = '';
var uright = '';
var prizes = ["5 Puan", "15 Puan", "20 Puan", "25 Puan", "35 Puan", "40 Puan", "45 Puan", "50 Puan", "55 Puan", "60 Puan", "70 Puan", "80 Puan", "85 Puan", "90 Puan", "100 Puan"];
var remaining = 30;
var timer = null;
var muted = false;
var halfJokerUsed = false;
var callJokerUsed = false;
var viewerJokerUsed = false;
var answers = [];
function toggleSound() {
	if (!muted) {
		Howler.volume(0);
		$('#soundBtn').html('Sesi Kapat');
		muted = true;
	} else {
		Howler.volume(0.3);
		$('#soundBtn').html('Sesi Aç');
		muted = false;
	}
}
var start_sound = new Howl({
	urls: ['assets/sounds/basla.mp3']
});
var sure_sound = new Howl({
	urls: ['assets/sounds/sec.mp3']
});
var devam_sound = new Howl({
	urls: ['assets/sounds/devam.mp3']
});
var true_sound = new Howl({
	urls: ['assets/sounds/dogru.mp3']
});
var false_sound = new Howl({
	urls: ['/assets/sounds/yanlis.mp3']
});
var start_call_sound = new Howl({
	urls: ['assets/sounds/ara.mp3']
});
var on_call_sound = new Howl({
	urls: ['assets/sounds/tussesi.mp3']
});
var viewer_sound = new Howl({
	urls: ['assets/sounds/seyirci.mp3']
});
var half_joker_sound = new Howl({
	urls: ['assets/sounds/yariyariya.mp3']
});
var alert_sound = new Howl({
	urls: ['assets/sounds/gerisayim.mp3']
});
function getQuestions() {
	$('#welcome').hide();
	$('#wait').show();
	$.getJSON('/assets/json/questions.json', function (data) {
		questions = data;
		showQuestions();
	});
}
function startGame() {
	current = 0;
	getQuestions();
	halfJokerUsed = false;
	callJokerUsed = false;
	viewerJokerUsed = false;

	$('#halfJoker').html('');
	$('#callJoker').html('');
	$('#viewerJoker').html('');
	var logo = document.querySelector('.logo');
	if (logo) {
		logo.style.display = 'none';
	}
	var secenekler = document.querySelector('.secenekler');
	if (secenekler) {
		secenekler.style.display = 'none';
	}
	var hosgeldin = document.querySelector('.hosgeldin');
	if (hosgeldin) {
		hosgeldin.style.display = 'none'
	}
}
function useHalfJoker() {
	if (!halfJokerUsed) {
		halfJokerUsed = true;
		half_joker_sound.play();
		$('#halfJoker').html('X');
		var rand_num = Math.floor(Math.random() * $("a[rel!='" + right + "'][class='answer'][class!='half']").size());
		$("a[rel!='" + right + "'][class='answer'][class!='half']").eq(rand_num).addClass('half').attr('onclick', "").find('.sorukutu > .cevap').html('');
		rand_num = Math.floor(Math.random() * $("a[rel!='" + right + "'][class='answer'][class!='half']").size());
		$("a[rel!='" + right + "'][class='answer'][class!='half']").eq(rand_num).addClass('half').attr('onclick', "").find('.sorukutu > .cevap').html('');
	}
}
function useCallJoker(calledName) {
	if (!callJokerUsed) {
		callJokerUsed = true;
		$('#callJoker').html('X');
		on_call_sound.play();
		var percent = 0;
		var aa = '';
		var op = '';
		if (current < 5) {
			percent = 100;
			aa = right;
		} else if (current < 8) {
			percent = getRandomIntInclusive(70, 90);
			aa = right;
		} else if (current < 12) {
			percent = getRandomIntInclusive(40, 70);
			aa = answers[Math.floor(Math.random() * answers.length)];
		} else if (current < 16) {
			percent = getRandomIntInclusive(0, 40);
			aa = answers[Math.floor(Math.random() * answers.length)];
		}
		op += '<b class="vurgu">' + calledName + ':</b> Merhaba.<br />';
		op += '<b>Sunucu:</b> Merhaba ' + calledName + ', arkadaşınız ' + prizes[current] + ' kazanmak üzere ve şimdi sizin yardımınıza ihtiyacı var.<br />';
		op += '<b>Sen:</b> ' + calledName + '... ' + questions[current].question + '<br />';
		op += '<b class="vurgu">' + calledName + ':</b> Cevabım ' + aa + '.<br />';
		op += '<b>Sen:</b> Peki emin misin?<br />';
		op += '<b class="vurgu">' + calledName + ':</b> %' + percent + ' eminim.';
		$('#callerOp').html(op);
		$('.qmain').hide();
		$('#qcallResult').show();
	}
}
function startCallJoker() {
	if (!callJokerUsed) {
		start_call_sound.play();
		$('.qmain').hide();
		$('#qcall').show();
	}
}
function useViewerJoker() {
	if (!viewerJokerUsed) {
		viewerJokerUsed = true;
		$('#viewerJoker').html('X');
		viewer_sound.play();
		var total = 100;
		var percent = 0;
		var tpercent = 0;
		var op = '';
		var maxpercent = 0;
		if (current < 7) {
			for (var i = 0; i < answers.length; i++) {
				if (answers[i] == right) {
					percent = getRandomIntInclusive(60, 80);
				} else {
					percent = Math.floor((100 - tpercent) / 3);
				}
				op += '<div style="float:left;">';
				op += '<div style="height:20px;width:' + percent + '%;display:block;border:1px solid #000;background:#fff;float:left;margin-right:10px;"></div>';
				op += ' %' + percent + ' ' + answers[i];
				op += '</div><div style="clear:both;"></div>';
				tpercent += percent;
			}
		} else if (current < 12) {
			for (var i = 0; i < answers.length; i++) {
				if (answers[i] == right) {
					percent = getRandomIntInclusive(30, 50);
				} else {
					percent = Math.floor((100 - tpercent) / 3);
				}
				op += '<div style="float:left;">';
				op += '<div style="height:20px;width:' + percent + '%;display:block;border:1px solid #000;background:#fff;float:left;margin-right:10px;"></div>';
				op += ' %' + percent + ' ' + answers[i];
				op += '</div><div style="clear:both;"></div>';
				tpercent += percent;
			}
		} else if (current < 16) {
			for (var i = 0; i < answers.length; i++) {
				if (answers[i] == right) {
					percent = getRandomIntInclusive(10, 40);
				} else {
					percent = Math.floor((100 - tpercent) / 3);
				}
				op += '<div style="float:left;">';
				op += '<div style="height:20px;width:' + percent + '%;display:block;border:1px solid #000;background:#fff;float:left;margin-right:10px;"></div>';
				op += ' %' + percent + ' ' + answers[i];
				op += '</div><div style="clear:both;"></div>';
				tpercent += percent;
			}
		}
		$('.qmain').hide();
		$('#viewerOp').html(op);
		$('#qviewer').show();
	}
}
function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}
function showQuestions() {
	$('#welcome').hide();
	$('#wait').hide();
	$('#wingame').hide();
	$('#questions').show();

	right = questions[current].correct_answer;
	var options = questions[current].options;
	if (current < 7) {
        remaining = 180;
    } else {
        // 7. sorudan sonra süre sınırsız olacak
        remaining = 9999;
    }

	$('.remaining').html(remaining === 9999 ? "Sınırsız" : remaining);
	$('#cprize').html(prizes[current]);
	$('.qmain').hide();
	$('#qwelcome').show();
	$('#question').html(questions[current].question);
	for (var i = 0; i < options.length; i++) {
		$('#a' + (i + 1) + ' > .sorukutu > .cevap').html(options[i]);
		$('#a' + (i + 1)).attr("rel", options[i]);
	}
	if (current === questions.length - 1) {
		$('.answer').attr('onclick', "showCorrectAnswer($(this));");
	} else {
		$('.answer').attr('onclick', "startCheckAnswer($(this));");
	}

	clearTimeout(timer);
    // 7. sorudan sonra süreyi gösterme
    if (current < 7) {
        timer = setTimeout(showRemaining, 1000);
    }
    devam_sound.play();
}
function showRemaining() {
	clearTimeout(timer);
	remaining--;
	if (remaining <= 10 && remaining > 0 && remaining % 2 == 0)
		alert_sound.play();
	if (remaining >= 0) {
		$('.remaining').html(remaining);
		timer = setTimeout(showRemaining, 1000);
	} else {
		loseGame();
	}
}
function winGame() {
    var kullaniciAdi = localStorage.getItem('kullaniciAdi') || "Yarışmacı";
    var prizeText = prizes[current - 1]; // Doğru puanı almak için current - 1 kullanıyoruz
    
    $('#lastPrize').html("Tebrikler " + kullaniciAdi + ", " + prizeText + " kazandınız!");
    
    $('#welcome').hide();
    $('#wait').hide();
    $('#questions').hide();
    
    var wingame = document.querySelector('#wingame');
    if (wingame.style.display === 'none') {
        wingame.style.display = 'block';
    }
    
    start_sound.play();
}


function startCheckAnswer(e) {
	$('.qmain').hide();
	$('#qsure').show();
	uright = e.attr('rel');
	e.find('.sorukutu').addClass('turuncu');
	$('.answer').attr('onclick', '');
	sure_sound.play();
}
function dismissAnswer() {
	$('.answer > .turuncu').removeClass('turuncu');
	$('.qmain').hide();
	$('#qwelcome').show();
	$('.answer').attr('onclick', "startCheckAnswer($(this));");
}
function checkAnswer() {
    $('.qsure').hide();
    if (uright == right) {
        $('#currentPrize').html(prizes[current]);
        current++;
        showPrizes();
        if (current === questions.length) { // Son soruya geldiysek
            setTimeout(function () {
                $('#qwin').show();
                winGame();
            }, 2000); // 2 saniye sonra qwin gösterilsin ve winGame fonksiyonu çağrılsın
        } else {
            $('.answer > .sorukutu').css('background-color', 'green');
            $('.qmain').hide();
            setTimeout(function () {
                $('#qwin').show();
                true_sound.play();
                showNextQuestion();
            }, 2000);
        }
    } else {
        $('.answer > .turuncu').removeClass('turuncu').addClass('kirmizi');
        $("a[rel='" + right + "'] > .sorukutu").addClass('yesil');
        $('.qmain').hide();
        setTimeout(function () {
            $('#qlose').show();
            loseGame();
        }, 2000); // 2 saniye sonra qlose gösterilsin ve loseGame fonksiyonu çağrılsın
    }
}


function loseGame() {
	clearTimeout(timer);
	if (current < 4)
		$('#lastLosePrize').html("5 Puan");
	else if (current < 9)
		$('#lastLosePrize').html("45 Puan");
	else if (current < 14)
		$('#lastLosePrize').html("65 Puan");
	$('.qmain').hide();
	$('#qlose').show();
	false_sound.play();
}
function showHowTo() {
	var logo = document.querySelector('.logo');
	if (logo) {
		logo.style.display = 'none';
	}
	var secenekler = document.querySelector('.secenekler');
	if (secenekler) {
		secenekler.style.display = 'none';
	}
	var hosgeldin = document.querySelector('.hosgeldin');
	if (hosgeldin) {
		hosgeldin.style.display = 'none'
	}
	$('#howto').show();
}
$(document).ready(function(){
    $('#howToButton').click(function(){
        showHowTo();
    });
});
function showCorrectAnswer() {
    $('#lastPrize').html(prizes[current - 1]);
    $('#welcome').hide();
    $('#wait').hide();
    $('#questions').hide();
    var wingame = document.querySelector('#wingame');
    if (wingame.style.display === 'none') {
        wingame.style.display = 'block';
    }   
    start_sound.play();
}
function showHome() {
	$('#wingame').hide();
	$('#wait').hide();
	$('#howto').hide();
	$('#questions').hide();
	var logo = document.querySelector('.logo');
	if (logo) {
		logo.style.display = 'block';
	}
	var secenekler = document.querySelector('.secenekler');
	if (secenekler) {
		secenekler.style.display = 'block';
	}
	var hosgeldin = document.querySelector('.hosgeldin');
	if (hosgeldin) {
		hosgeldin.style.display = 'block'
	}
}
function showPrizes() {
	var start = current - 1;
	var end = current + 4;
	var prizesToShow = prizes.slice(start, end);
	var prizesText = "";
	for (var i = 0; i < prizesToShow.length; i++) {
		prizesText += (i + 1) + ". " + prizesToShow[i] + "<br>";
	}
	$('.text').html(prizesText);
}