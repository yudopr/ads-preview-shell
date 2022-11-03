var fullPath = '';
var shellParams = {
    isDev: false,
    useEnabler: false, /* IMPORTANT!! We have to manually put Enabler's script tag on the HTML for DC Studio to detect it. DC Studio won't detect generated script tag for their Enabler */
    unit: {
        width: 300,
        height: 250,
        backgroundColor: '#282729',
        preloader: {
            bgColor: "#282729",
            color: '#BB8740',                /* preloader color, use color HEX code or leave it blank for UNFOLD default color */
            size: 56
        },
        border: {
            color: '#BB8740',                /* border color, use color HEX code or leave it blank for none */
            image: ''                        /* border image, if specified border color will be ignored */
        },
        audio: {
            active: true,                    /* default false, 2 parameters below will be ignored. If true you'll need to specified 2 parameters below */
            color: {                         /* bar color, use color HEX code */
                off: '#BB8740',              /* required */
                on: '#e3e3e3'                /* required */
            },
            position: {
                on: "top-left",             /* `top-left`, `top-right`, `bottom-left`, `bottom-right` */
                xOffset: -2,                /* x offset based on “on” position */
                yOffset: -2                /* y offset based on “on” position */
            },
            disappearAt: 1.9                 /* set audio button disappear time in second  */
        }
    },
    cta: {
        active: true,                       /* default true, set to false for no cta & all body rollover */
        advanced: false,                    /* if true CTA will use SVG animation based on Lottie (rarely the case), cta_on & cta_off assets won't be needed & animationRoll property become irrelevant */
        ctaOff: 'resolve_cta_off.png',   /* cta image name or css acceptable color */
        ctaOn: 'resolve_cta_on.png',                          /* cta image name  or css acceptable color */
        ctaFile: '',                        /* only used when advanced option is true */
        ctaWidth: 120,                      /* in pixel */
        ctaHeight: 29,                      /* in pixel */
        ctaX: 20,                          /* in pixel */
        ctaY: 200,                          /* in pixel */
        ctaAnimation: {
            start: 1,                     /* in seconds */
            duration: 0.4,                    /* in second */
            animationIn: {
                type: "custom",             /* `fade`, `slide`, `slideFade`, `scaleFade`, `custom` */
                from: {
                    x: 0,                   /* in pixel */
                    y: 0,                   /* in pixel */
                    scale: 1                /* 1 = 100%, 1.05 = 105%, etc*/
                }
            },
            animationRoll: {
                type: "slide",            /* `slide`, `shine`, `custom` ask dev for help */
                from: "bottom",               /* `top`, `right`, `bottom`, or `left` */
                time: 0.3,                 /* in seconds */
            }
        },
    },
    replay: {
        size: 10,
        appearAt: 2,                        /* required, default 0 to follow resolve timeline */
        replayOff: '#BB8740',/* required */
        replayOn: '#e3e3e3',                /* optional */
        inverseRotation: false,
        position: {
            on: "top-left",                 /* `top-left`, `top-right`, `bottom-left`, `bottom-right` */
            xOffset: 0,                   /* x offset based on “on” position */
            yOffset: 0                    /* y offset based on “on” position */,
            iconPadding: 6                 /* the icon padding based on X & Y position */
        },
        hideOnRollover: false              /* boolean */
    },
    rollover: {
        video: true, /* True if the rollover is using Video, False if the rollover using codes */
        hideElements: {
            active: true, /* if true hovering over the CTA will hide specified elements */
            hide: {
                time: 0, /* when the elements should hide */
                duration: 0.3 /* duration of the hiding animation of the elements */
            },
            show: {
                time: 4, /* when the elements should show */
                duration: 0.3 /* duration of the showing animation of the elements */
            },
            elements: ['#resolve_logo'] /* specified elements */
        }
    }
}

/* Custom assets, resolve animation & cta rollover animation */
function customAssets(_path) {
    if (shellParams.isDev) {
        addImage('backup', _path + 'backup.png');
        gsap.set('#backup', {opacity:.5});
    }
    // addImage('resolve_date', _path + 'resolve_date_1.png');
    gsap.set('#resolve_cta', { borderRadius: 3 });
    gsap.set('#resolve_logo', { backgroundColor: 'rgba(255, 143, 200, 0.5)', top: -70, right: -100, left: 'unset', borderRadius: '50%', scaleX: 0.2, scaleY: 0.23 });
}
function customResolveTL(_tl) {
    _tl.from('#resolve_cta', { autoAlpha: 0, duration: 0.01, ease: 'none' }, 'start+=' + shellParams.cta.ctaAnimation.start);
    _tl.from(['.cta_off'], { y: -29, duration: 0.6, ease: 'power2.out' }, '<');
    _tl.from('#resolve_logo', { opacity: 0, y: -100, duration: 1, ease: 'elastic.out' }, '<');
    return _tl;
}
function customCTARollTL(_tl) {
    // _tl.to('.cta_on', {opacity:1, duration:0.5, ease:'none'}, 'start');
    return _tl;
}
function customRoll(ctaRollTL) {
    // ctaRollTL.tweenFromTo('start', 'out');
    ctaRollTL.play(0);
}
function customOut(ctaRollTL) {
    // ctaRollTL.tweenFromTo('out', 'end');
    ctaRollTL.reverse();
}
