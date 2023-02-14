//set animation timing
let animationDelay = 2500,
    //loading bar effect
    barAnimationDelay = 3800,
    barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
    //letters effect
    lettersDelay = 50,
    //type effect
    typeLettersDelay = 150,
    selectionDuration = 500,
    typeAnimationDelay = selectionDuration + 800,
    //clip effect 
    revealDuration = 600,
    revealAnimationDelay = 1500;

initHeadline();

const initHeadline = () => {
    //insert <i> element for each letter of a changing word
    singleLetters(document.querySelector('.cd-headline.letters').find('b'));
    //initialise headline animation
    animateHeadline(document.querySelector('.cd-headline'));
}

const singleLetters = ($words) => {
    $words.each(function () {
        let word = document.querySelector(this),
            letters = word.text().split(''),
            selected = word.classList.contains('is-visible');
        for (i in letters) {
            if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
            letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
        }
        let newLetters = letters.join('');
        word.html(newLetters).css('opacity', 1);
    });
}

const animateHeadline = ($headlines) => {
    let duration = animationDelay;
    $headlines.each(function () {
        let headline = document.querySelector(this);

        if (headline.classList.contains('loading-bar')) {
            duration = barAnimationDelay;
            setTimeout(function () {
                headline.find('.cd-words-wrapper').classList.add('is-loading')
            }, barWaiting);
        } else if (headline.classList.contains('clip')) {
            let spanWrapper = headline.find('.cd-words-wrapper'),
                newWidth = spanWrapper.width() + 10
            spanWrapper.css('width', newWidth);
        } else if (!headline.classList.contains('type')) {
            //assign to .cd-words-wrapper the width of its longest word
            let words = headline.find('.cd-words-wrapper b'),
                width = 0;
            words.each(function () {
                let wordWidth = document.querySelector(this).width();
                if (wordWidth > width) width = wordWidth;
            });
            headline.find('.cd-words-wrapper').css('width', width);
        };

        //trigger animation
        setTimeout(function () {
            hideWord(headline.find('.is-visible').eq(0))
        }, duration);
    });
}

const hideWord = ($word) => {
    var nextWord = takeNext($word);

    if ($word.parents('.cd-headline').classList.contains('type')) {
        var parentSpan = $word.parent('.cd-words-wrapper');
        parentSpan.classList.add('selected').classList.remove('waiting');
        setTimeout(function () {
            parentSpan.classList.remove('selected');
            $word.classList.remove('is-visible').classList.add('is-hidden').children('i').classList.remove('in').classList.add('out');
        }, selectionDuration);
        setTimeout(function () {
            showWord(nextWord, typeLettersDelay)
        }, typeAnimationDelay);

    } else if ($word.parents('.cd-headline').classList.contains('letters')) {
        var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
        hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
        showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

    } else if ($word.parents('.cd-headline').classList.contains('clip')) {
        $word.parents('.cd-words-wrapper').animate({
            width: '2px'
        }, revealDuration, function () {
            switchWord($word, nextWord);
            showWord(nextWord);
        });

    } else if ($word.parents('.cd-headline').classList.contains('loading-bar')) {
        $word.parents('.cd-words-wrapper').classList.remove('is-loading');
        switchWord($word, nextWord);
        setTimeout(function () {
            hideWord(nextWord)
        }, barAnimationDelay);
        setTimeout(function () {
            $word.parents('.cd-words-wrapper').classList.add('is-loading')
        }, barWaiting);

    } else {
        switchWord($word, nextWord);
        setTimeout(function () {
            hideWord(nextWord)
        }, animationDelay);
    }
}

const showWord = ($word, $duration) => {
    if ($word.parents('.cd-headline').classList.contains('type')) {
        showLetter($word.find('i').eq(0), $word, false, $duration);
        $word.classList.add('is-visible').classList.remove('is-hidden');

    } else if ($word.parents('.cd-headline').classList.contains('clip')) {
        $word.parents('.cd-words-wrapper').animate({
            'width': $word.width() + 10
        }, revealDuration, function () {
            setTimeout(function () {
                hideWord($word)
            }, revealAnimationDelay);
        });
    }
}

const hideLetter = ($letter, $word, $bool, $duration) => {
    $letter.classList.remove('in').classList.add('out');

    if (!$letter.is(':last-child')) {
        setTimeout(function () {
            hideLetter($letter.next(), $word, $bool, $duration);
        }, $duration);
    } else if ($bool) {
        setTimeout(function () {
            hideWord(takeNext($word))
        }, animationDelay);
    }

    if ($letter.is(':last-child') && document.querySelector('html').classList.contains('no-csstransitions')) {
        var nextWord = takeNext($word);
        switchWord($word, nextWord);
    }
}

const showLetter = ($letter, $word, $bool, $duration) => {
    $letter.classList.add('in').classList.remove('out');

    if (!$letter.is(':last-child')) {
        setTimeout(function () {
            showLetter($letter.next(), $word, $bool, $duration);
        }, $duration);
    } else {
        if ($word.parents('.cd-headline').classList.contains('type')) {
            setTimeout(function () {
                $word.parents('.cd-words-wrapper').classList.add('waiting');
            }, 200);
        }
        if (!$bool) {
            setTimeout(function () {
                hideWord($word)
            }, animationDelay)
        }
    }
}

const takeNext = ($word) => {
    return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
}

const takePrev = ($word) => {
    return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
}

const switchWord = ($oldWord, $newWord) => {
    $oldWord.classList.remove('is-visible').classList.add('is-hidden');
    $newWord.classList.remove('is-hidden').classList.add('is-visible');
}