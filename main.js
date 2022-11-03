if (shellParams.enabler.active) {
    addEvent(window, 'DOMContentLoaded', function(){
        if(typeof Enabler == "undefined"){
            warning("Please embed DC's Enabler script tag");
        }else{
            if (!Enabler.isInitialized()) {
                Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitialized);
            } else {
                enablerInitialized();
            }
        }
    });
} else {
    window.clickTag = shellParams.enabler.exits.generic;
    log("Click Tag", window.clickTag);
    addEvent(window, 'DOMContentLoaded', ondomloaded);
}
function enablerInitialized() {
    if (!Enabler.isVisible()) {Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, adVisible);
    } else {
        adVisible();
    }
}
function adVisible() {
    ondomloaded();
}
var canRoll = false, resolveTL, ctaRollTL;
var firstTime = true;
var resolve_bg, resolve_bgr_url = 'assets/resolve.mp4';
var resolve_rollover, resolve_rollover_url = 'assets/rollover.mp4';
function ondomloaded(){
    clearFaviconErr();

    resolve_bgr_url = fixFullPath(fullPath) + resolve_bgr_url;
    resolve_rollover_url = fixFullPath(fullPath) + resolve_rollover_url;
    fullPath = fixFullPath(fullPath) + 'assets/';

    // preloader
    // addImage('preloader-icon', fullPath + 'preloader.png');
    gsap.set('.line', {stroke: shellParams.unit.preloader.color});
    gsap.set('#preloader', {backgroundColor:shellParams.unit.preloader.bgColor});
    gsap.set('#preloader-icon', {
        backgroundColor: shellParams.unit.preloader.bgColor,
        width: shellParams.unit.preloader.size,
        height: shellParams.unit.preloader.size,
        top: 'calc(50% - ' + shellParams.unit.preloader.size/2+'px)',
        left: 'calc(50% - ' + shellParams.unit.preloader.size/2+'px)'
    });
    
    if(shellParams.isDev){
        if(resolve_bg){
            resolve_bg.play().catch(e=>{
                setTimeout(e=>{
                    hide('preloader');
                    //show('resolve_bg', 0.3);
                    resolveTL.pause("end");
                }, 100)
            })
        }
        attachDebugger(()=>{
            setupUnit();
            setupCTA();
            setupVideo();
        });
    }else{
        setupUnit();
        setupCTA();
        setupVideo();
    }


}
function setupUnit(){
    gsap.set('#preloader', {background:shellParams.unit.preloader.bgColor});
    gsap.set('.page', {backgroundColor:shellParams.unit.backgroundColor});
    gsap.set('#page', {width:shellParams.unit.width, height:shellParams.unit.height});
    // custom
    // addImage('resolve_cta_txt', fullPath + 'resolve_cta_txt.png');
    if(customAssets){
        customAssets(fullPath);
    }
    // border
    if(shellParams.unit.border.image.length > 0){
        gsap.set('#border', {width:'100%', height:'100%', border:'initial'});
        addImage('border', (fullPath + shellParams.unit.border.image));
    }else{
        gsap.set('#border', {borderColor:shellParams.unit.border.color.length > 0 ? shellParams.unit.border.color : 'transparent'});
    }

    // audio
    if(shellParams.unit.audio.active){
        /* setup bar movement */
        // addImage('btn_unmute', fullPath + shellParams.unit.audio.image);
        var btn_unmute = document.getElementById('btn_unmute');
        btn_unmute.soundButton(shellParams.unit.audio.color.off);
        tapcomponent('btn_unmute', onAudioTap, onAudioRoll, onAudioOut);
        tapcomponent('btn_mute', onAudioTap, onAudioRoll, onAudioOut);

        var btn_mute = document.querySelector('#btn_mute');
        btn_mute.style['grid-template-columns'] = 'repeat(' + btn_mute.children.length + ', 1fr)';
        gsap.to('.bar', {duration:0, backgroundColor:shellParams.unit.audio.color.off});

        gsap.to('.bar', {
            duration: 0.3,
            scaleY: random(0.5, 0.7),
            transformOrigin: 'center bottom',
            ease: "steps(2)",
            stagger: {
                amount: 0.1,
                from: 'random',
                repeat:-1,
                yoyo:true
            }
        });
        gsap.to('.button_unmute', {duration:0, autoAlpha:0});

        /* position presets */
        var audioXOffset = shellParams.unit.audio.position.xOffset;
        var audioYOffset = shellParams.unit.audio.position.yOffset;
        switch (shellParams.unit.audio.position.on) {
            case "top-right":
                    gsap.to('#audio', {duration: 0.01, left:'unset', top:audioYOffset, right:audioXOffset});
                    gsap.to('#btn_unmute', {duration: 0.01, left:14, top:0});
                    gsap.to('#btn_mute', {duration: 0.01, left:21, top:7});
                break;
            case "bottom-right":
                    gsap.to('#audio', {duration: 0.01, left:'unset', top:'unset', bottom:audioYOffset, right:audioXOffset});
                    gsap.to('#btn_unmute', {duration: 0.01, left:13, top:13});
                    gsap.to('#btn_mute', {duration: 0.01, left:20, top:20});
                break;
            case "bottom-left":
                gsap.to('#audio', {duration: 0.01, left:audioXOffset, top:'unset', bottom:audioYOffset});
                gsap.to('#btn_unmute', {duration: 0.01, left:0, top:15});
                gsap.to('#btn_mute', {duration: 0.01, left:7, top:22});
                break;
            default:
                gsap.to('#audio', {duration: 0.01, left:audioXOffset, top:audioYOffset});
                break;
        }
    }else{
        gsap.to('#audio', {duration:0, display:'none'});
    }
}
function onAudioTap(e){
    if(firstTime){
        onReplay();
    }
    if(resolve_bg){
        resolve_bg.muted = !resolve_bg.muted;
        toggleAudioButton(resolve_bg.muted);
    }
    firstTime = false;
}
function toggleAudioButton(_muted){
    if(!_muted)  {
        gsap.to('.button_mute', {duration:0, autoAlpha:0});
        gsap.to('.button_unmute', {duration:0, autoAlpha:1});
    }else{
        gsap.to('.button_mute', {duration:0, autoAlpha:1});
        gsap.to('.button_unmute', {duration:0, autoAlpha:0});
    }
}
function onAudioRoll(e){
    if(e.currentTarget.id == 'btn_mute'){
        gsap.to('.bar', {duration:0.2, backgroundColor:shellParams.unit.audio.color.on});
    }else{
        gsap.to('.fill_color', {duration:0.2, fill:shellParams.unit.audio.color.on});
        gsap.to(['#auline2', '#auline1'], {duration:0.2, x:2, scale:1.3, opacity:0, transformOrigin:"50% 50%", stagger:0.1, onComplete:function(){
            gsap.fromTo(['#auline2', '#auline1'], {x:-2, opacity:0, scale:1}, {duration:0.2, x:0, opacity:1, scale:1, stagger:0.1});
        }});
    }
}
function onAudioOut(e){
    if(e.currentTarget.id == 'btn_mute'){
        gsap.to('.bar', {duration:0.2, backgroundColor:shellParams.unit.audio.color.off});
    }else{
        gsap.to('.fill_color', {duration:0.2, fill:shellParams.unit.audio.color.off});
    }
}
function setupCTA(){
    /* ====== REPLAY ====== */
    var replayBtn = document.getElementById('resolve_replay');
    replayBtn.replayColor(shellParams.replay.replayOff);
    gsap.set('#replay_icon', {width:shellParams.replay.size, height:shellParams.replay.size});
    if(shellParams.replay.inverseRotation) gsap.set('#replay_icon', {scaleX:-1});
    var replayXoffset = shellParams.replay.position.xOffset;
    var replayYoffset = shellParams.replay.position.yOffset;
    var padding = shellParams.replay.position.iconPadding;
    switch (shellParams.replay.position.on) {
        case "top-right":
                replayBtn.style.top = replayYoffset + 'px';
                replayBtn.style.right = replayXoffset +'px';
                replayBtn.style.left = 'unset';
                gsap.to('#replay_icon', {duration: 0.01, left:'unset', top:padding, right:padding});
            break;
        case "bottom-right":
                replayBtn.style.top = 'unsetuto';
                replayBtn.style.right = replayXoffset + 'px';
                replayBtn.style.bottom = replayYoffset + 'px';
                replayBtn.style.left = 'unset';
                gsap.to('#replay_icon', {duration: 0.01, left:'unset', top:'unset', bottom:padding, right:padding});
            break;
        case "bottom-left":
                replayBtn.style.top = 'unset';
                replayBtn.style.bottom = replayYoffset + 'px';
                replayBtn.style.left = replayXoffset + 'px';
                gsap.to('#replay_icon', {duration: 0.01, top:'unset', left:padding, bottom:padding});
            break;
        default:
            replayBtn.style.left = replayXoffset + 'px';
            replayBtn.style.top = replayYoffset + 'px';
            gsap.to('#replay_icon', {duration: 0.01, left:padding, top:padding});
            break;
    }
    
    /* ====== CTA ====== */
    var cta = document.getElementById('resolve_cta');
    if(!shellParams.cta.advanced){
        if(shellParams.cta.ctaOff.indexOf('.png') >= 0){
            addImage(cta.id+'_off', (fullPath + shellParams.cta.ctaOff));
            addImage(cta.id+'_on', (fullPath + shellParams.cta.ctaOn));
        }else{
            gsap.set('#'+cta.id+'_off', {backgroundColor:shellParams.cta.ctaOff});
            gsap.set('#'+cta.id+'_on', {backgroundColor:shellParams.cta.ctaOn});
        }
    }
    cta.style.width = shellParams.cta.ctaWidth + 'px';
    cta.style.height = shellParams.cta.ctaHeight + 'px';
    cta.style.left = shellParams.cta.ctaX + 'px';
    cta.style.top = shellParams.cta.ctaY + 'px';

    resolveTL = gsap.timeline({paused:true, onStart:function(){if (typeof timelineControl == 'function') gsap.delayedCall(1, timelineControl)}});
    resolveTL.addLabel('start');
    switch(shellParams.cta.ctaAnimation.animationIn.type){
        case "slide":
            resolveTL.fromTo(cta, {x:shellParams.cta.ctaAnimation.animationIn.from.x, y:shellParams.cta.ctaAnimation.animationIn.from.y || 5}, {duration: shellParams.cta.ctaAnimation.duration, x:0, y:0, overwrite:'auto'}, 'start+=' + shellParams.cta.ctaAnimation.start);
            success("Preset resolve animation");
            break;
        case "slideFade":
            resolveTL.fromTo(cta, {autoAlpha:0, x:shellParams.cta.ctaAnimation.animationIn.from.x || 0, y:shellParams.cta.ctaAnimation.animationIn.from.y || 5}, {duration: shellParams.cta.ctaAnimation.duration, autoAlpha:1, x:0, y:0, overwrite:'auto'}, 'start+=' + shellParams.cta.ctaAnimation.start);
            success("Preset resolve animation");
            break;
        case "scaleFade":
            resolveTL.fromTo(cta, {autoAlpha:0, scale:shellParams.cta.ctaAnimation.animationIn.from.scale || 1.05}, {duration: shellParams.cta.ctaAnimation.duration, autoAlpha:1, scale:1, overwrite:'auto'}, 'start+=' + shellParams.cta.ctaAnimation.start);
            success("Preset resolve animation");
            break;
            case "custom":
            /* reserved for custom type animation */
            resolveTL = customResolveTL(resolveTL);
            success("Custom resolve animation");
            break;
        default: /* fade */
            resolveTL.fromTo(cta, {autoAlpha:0}, {duration: shellParams.cta.ctaAnimation.duration, autoAlpha:1, overwrite:'auto'}, 'start+=' + shellParams.cta.ctaAnimation.start);
            resolveTL.fromTo('#resolve_stadia', {autoAlpha:0}, {duration: shellParams.cta.ctaAnimation.duration, autoAlpha:1, overwrite:'auto'}, 'start+=' + shellParams.cta.ctaAnimation.start);
            success("Preset resolve animation");
        break;
    }
    if(shellParams.unit.audio.active){
        resolveTL.fromTo('#audio', {autoAlpha:1}, {duration: 0.2, autoAlpha:0, overwrite:'auto'}, 'start+=' + (shellParams.unit.audio.disappearAt));
}
    resolveTL.fromTo(replayBtn, {autoAlpha:0}, {duration: shellParams.cta.ctaAnimation.duration, autoAlpha:1, overwrite:'auto'}, 'start+=' + (shellParams.replay.appearAt > 0 ? shellParams.replay.appearAt : shellParams.cta.ctaAnimation.start+.3));
    resolveTL.addLabel("end");

    ctaRollTL = gsap.timeline({paused:true});
    ctaRollTL.addLabel('start');
    switch (shellParams.cta.ctaAnimation.animationRoll.type) {
        case "slide":
            if(shellParams.cta.ctaAnimation.animationRoll.from == "top"){
                ctaRollTL.fromTo('#'+cta.id+'_on', {opacity:1, y:-cta.offsetHeight}, {duration: shellParams.cta.ctaAnimation.animationRoll.time, y:0}, 'start');
                ctaRollTL.fromTo('#'+cta.id+'_off', {y:0}, {duration: shellParams.cta.ctaAnimation.animationRoll.time, y:cta.offsetHeight}, 'start');
            }
            else if(shellParams.cta.ctaAnimation.animationRoll.from == "right"){
                ctaRollTL.fromTo('#'+cta.id+'_on',  {opacity:1, x:cta.offsetWidth}, {duration: shellParams.cta.ctaAnimation.animationRoll.time, x:0}, 'start');
                ctaRollTL.fromTo('#'+cta.id+'_off', {x:0}, {duration: shellParams.cta.ctaAnimation.animationRoll.time, x:-cta.offsetWidth}, 'start');
            }
            else if(shellParams.cta.ctaAnimation.animationRoll.from == "bottom"){
                ctaRollTL.fromTo('#'+cta.id+'_on', {opacity:1, y:cta.offsetHeight}, {duration: shellParams.cta.ctaAnimation.animationRoll.time, y:0}, 'start');
                ctaRollTL.fromTo('#'+cta.id+'_off', {y:0}, {duration: shellParams.cta.ctaAnimation.animationRoll.time, y:-cta.offsetHeight}, 'start');
            }
            else if(shellParams.cta.ctaAnimation.animationRoll.from == "left"){
                ctaRollTL.fromTo('#'+cta.id+'_on', {opacity:1, x:-cta.offsetWidth}, {duration: shellParams.cta.ctaAnimation.animationRoll.time, x:0}, 'start');
                ctaRollTL.fromTo('#'+cta.id+'_off', {x:0}, {duration: shellParams.cta.ctaAnimation.animationRoll.time, x:cta.offsetWidth}, 'start');
            }
            break;
        case "shine":
                ctaRollTL.fromTo('#'+cta.id+'_off', {webkitFilter:'brightness(1) contrast(1)', filter:'brightness(1) contrast(1)'}, {duration:shellParams.cta.ctaAnimation.animationRoll.time, webkitFilter:'brightness(1) contrast(1.5)', filter:'brightness(1) contrast(1.3)'}, 'start');
                ctaRollTL.fromTo('#'+cta.id+'_on', {opacity:0, webkitFilter:'brightness(1.8) contrast(1.3)', filter:'brightness(1.8) contrast(1.3)'}, {duration:shellParams.cta.ctaAnimation.animationRoll.time, opacity:1, webkitFilter:'brightness(1) contrast(1)', filter:'brightness(1) contrast(1)'}, 'start+=0.15');
            break;
        case "custom":
            if(shellParams.cta.advanced){
                ctaRollTL = bodymovin.loadAnimation({
                    container: document.getElementById('resolve_cta'),
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: fullPath + shellParams.cta.ctaFile
                  })
            }else{
                ctaRollTL = customCTARollTL(ctaRollTL);
                success("Custom CTA animation");
            }
            break;
        default: /* fade */
            ctaRollTL.fromTo('#'+cta.id+'_on', {opacity:0}, {duration: shellParams.cta.ctaAnimation.animationRoll.time, opacity:1}, 'start');
            ctaRollTL.fromTo('#'+cta.id+'_off', {opacity:1}, {duration: shellParams.cta.ctaAnimation.animationRoll.time*1.5, opacity:0});
            break;
    }

    /* ====== EVENTS ====== */
    if(shellParams.cta.active) tapcomponent(cta.id, onExit, onRoll, onOut);
    else tapcomponent('resolve_exit', onExit, onRoll, onOut);

    tapcomponent(replayBtn.id, onReplay, onReplayRoll, onReplayOut);
    tapcomponent('resolve_exit', onExit);
}

function onReplayRoll(e){
    gsap.to('#replay_icon', {duration: 0.5, rotation:shellParams.replay.inverseRotation? 360 : -360});
    if(shellParams.replay.replayOn){
        gsap.to('#replay_arrow', {duration:0.2, fill:shellParams.replay.replayOn});
    }
}
function onReplayOut(e){
    gsap.to('#replay_icon', {duration: 0.5, rotation:0});
    if(shellParams.replay.replayOn){
        gsap.to('#replay_arrow', {duration:0.2, fill:shellParams.replay.replayOff});
    }
}
function onReplay(e){
    firstTime = false;
    canRoll = false;
    show('resolve_bg');
    if(resolve_bg) {
        resolve_bg.currentTime = 0;
        resolve_bg.play();
    }
    if(resolveTL) resolveTL.restart(false, false);
    if(shellParams.enabler.active){
        if(shellParams.enabler.counters){
            shellParams.enabler.counters.replay();
        }
    }
}
function onRoll(e){
    if(shellParams.cta.advanced){
        if(ctaRollTL){
            ctaRollTL.setDirection(1);
            ctaRollTL.play();
        }
    }else{
        // ctaRollTL.play();
        customRoll(ctaRollTL);
        success("Custom onRoll animation");
    }
    playRollover();
    if(shellParams.enabler.active){
        if(shellParams.enabler.counters){
            shellParams.enabler.counters.rollover();
        }
    }
}
function onOut(e){
    if(shellParams.cta.advanced){
        if(ctaRollTL){
            ctaRollTL.setDirection(-1);
            ctaRollTL.play();
        }
    }else{
        // ctaRollTL.reverse();
        customOut(ctaRollTL);
        success("Custom onOut animation");
    }
}
function onExit(e){
    firstTime = false;
    stopVideo(resolve_bg);
    stopVideo(resolve_rollover);
    hide('resolve_bg');
    show('resolve_rollover');
    if(shellParams.rollover.hideElements.active) gsap.set(shellParams.rollover.hideElements.elements, {autoAlpha:1, overwrite:'auto'})
    gsap.to('#resolve_cta', {duration:0.01, opacity:1, overwrite:'auto'});
    if(shellParams.replay.hideOnRollover) show('resolve_replay');
    resolveTL.pause("end");
    if(shellParams.enabler.active){
        if(shellParams.enabler.singleExit){
            shellParams.enabler.exits.default();
        }else{
            switch (e.target.id) {
                case 'resolve_cta':
                    shellParams.enabler.exits.cta();
                    break;
                default:
                    shellParams.enabler.exits.default();
                    break;
            }
        }
        warning("Exit using Enabler")
    }else{
        warning("Exit using ClickTag")
        window.open(window.clickTag, "blank");
    }
}

function setupVideo(){
    if(!resolve_bg){
        resolve_bg = createVideo('resolve_bg', (shellParams.enabler.active ? Enabler.getUrl(resolve_bgr_url) : resolve_bgr_url), true, true);
        addEvent(resolve_bg, 'playing', onResolvePlay);
        addEvent(resolve_bg, 'pause', onResolvePause);
        addEvent(resolve_bg, 'timeupdate', onTimeUpdate);
        addEvent(resolve_bg, 'ended', onResolveEnd);
        addEvent(resolve_bg, 'volumechange', onResolveVolChange);
    }

    if(shellParams.rollover.video){
        if(!resolve_rollover){
            resolve_rollover = createVideo('resolve_rollover', (shellParams.enabler.active ? Enabler.getUrl(resolve_rollover_url) : resolve_rollover_url), false, true);
            resolve_rollover.load();
            addEvent(resolve_rollover, 'playing', onRolloverPlay);
            addEvent(resolve_rollover, 'timeupdate', onRolloverProgress);
            addEvent(resolve_rollover, 'ended', onRolloverEnd);
        }
    }else{
        addImage('resolve_rollover', fullPath + 'resolve_bg.jpg');
    }
}
function playRollover(){
    if(canRoll){
        if(resolve_rollover) resolve_rollover.play();
    }
}

function onResolvePlay(e){
    if(shellParams.unit.audio.active && !firstTime) resolve_bg.muted = false;
    hide('preloader');
    show('resolve_bg', 0.3);
    resolveTL.play();
}
var videoEnd = false;
function onResolvePause(e){
    if(!videoEnd) resolveTL.pause();
}
function onTimeUpdate(e){
    if(e.target.currentTime >= (e.target.duration-0.1)){
        videoEnd = true;
    }else{
        videoEnd = false;
    }
}
function onResolveVolChange(e){
    toggleAudioButton(e.target.muted);
}
function onResolveEnd(e){
    canRoll = true;
    hide('resolve_bg', shellParams.cta.ctaAnimation.duration);
}
// var isRoll1 = false, isRoll2 = false;
function onRolloverPlay(e){
    e.target.hideState = false;
    e.target.showState = false;
    if(shellParams.rollover.hideElements.active && shellParams.rollover.hideElements.hide.time <= 0){
        e.target.hideState = true;
        gsap.to(shellParams.rollover.hideElements.elements, {opacity:0, overwrite:'auto', duration: shellParams.rollover.hideElements.hide.duration});
    }
    if(shellParams.replay.hideOnRollover) hide('resolve_replay');
    canRoll = false;
}
function onRolloverProgress(e){
    if(shellParams.rollover.hideElements.active) {
        if (e.target.currentTime >= shellParams.rollover.hideElements.hide.time){
            if(!e.target.hideState) {
                e.target.hideState = true;
                gsap.to(shellParams.rollover.hideElements.elements, {opacity:0, overwrite:'auto', duration: shellParams.rollover.hideElements.hide.duration})
            }
        }
        shellParams.rollover.hideElements.show.time = (shellParams.rollover.hideElements.show.time > e.target.duration) ? e.target.duration : shellParams.rollover.hideElements.show.time;
        if(e.target.currentTime >= shellParams.rollover.hideElements.show.time){
            if(!e.target.showState){
                e.target.showState = true;
                gsap.to(shellParams.rollover.hideElements.elements, {opacity:1, overwrite:'auto', duration: shellParams.rollover.hideElements.show.duration})
            }

        }
    }
}
function onRolloverEnd(e){
    if(shellParams.replay.hideOnRollover) show('resolve_replay', 0.3);
    canRoll = true;
}
function stopVideo(e){e instanceof HTMLMediaElement&&(e.currentTime=0,e.pause()),canRoll=!0}
function createVideo(c,d,b,e,f){var a=document.createElement("video");a.setAttribute("x-webkit-airplay","allow");a.setAttribute("webkit-playsinline","true");a.setAttribute("playsinline","");b&&(a.autoplay=!0);f&&(a.controls=!0);e&&(a.muted=!0);d&&(b=document.createElement("source"),b.setAttribute("src",d),b.setAttribute("type","video/mp4"),a.appendChild(b));a.style.width="100%";a.style.height="100%";(c=document.getElementById(c))&&c.appendChild(a);return a};
function addEvent(a,b,c){a&&("string"===typeof a||a instanceof String?document.getElementById(a).addEventListener(b,c):a.addEventListener(b,c))}
function removeEvent(a,b,c){a&&("string"===typeof a||a instanceof String?document.getElementById(a).removeEventListener(b,c):a.removeEventListener(b,c))};
function tapcomponent(e,t,n,d){document.getElementById(e).addEventListener("click",t),n&&document.getElementById(e).addEventListener("mouseover",n),d&&document.getElementById(e).addEventListener("mouseout",d),n&&document.getElementById(e).addEventListener("touchstart",n,{passive:!0}),d&&document.getElementById(e).addEventListener("touchend",d,{passive:!0})}
function addImage(e, t, n) { var d = document.getElementById(e); d && ("img" === d.nodeName.toLowerCase() || "gwd-img" === d.nodeName.toLowerCase() ? n && window.devicePixelRatio >= 2 ? d.src = (n) : d.src = (t) : d.style.backgroundImage = "url('" + (shellParams.enabler.active ? Enabler.getUrl(t) : (t)) + "')")}
function hide(o,a){gsap.to("#"+o,{duration:a?.3:0, autoAlpha:0, overwrite:'auto'})}function show(o,a){gsap.to("#"+o,{duration:a?.3:0,autoAlpha:1, overwrite:'auto'})}
function fixFullPath(t){return 0<t.length?"/"===t.substr(t.length-1)?t:t+"/":""}
function random(n,r){if(null==r&&(r=n,n=0),r<n){var a=n;n=r,r=a}return n+(r-n)*Math.random()}
HTMLElement.prototype.replayColor=function(e){return t=document.createElementNS("http://www.w3.org/2000/svg","svg"),t.id="replay_icon",t.setAttribute("width","100%"),t.setAttribute("height","100%"),t.setAttribute("viewBox","0 0 60 60"),t.innerHTML='<path d="M10.779,7.204c5.171,-4.49 11.886,-7.204 19.221,-7.204c16.325,0 29.579,13.443 29.579,30c0,16.557 -13.254,30 -29.579,30c-16.325,0 -29.579,-13.443 -29.579,-30l10.292,0c0,10.796 8.642,19.561 19.287,19.561c10.645,0 19.287,-8.765 19.287,-19.561c0,-10.796 -8.642,-19.561 -19.287,-19.561c-4.494,0 -8.631,1.562 -11.911,4.18l6.172,6.259l-20.585,0l0,-20.878l7.103,7.204Z" id="replay_arrow" class="button" style="fill:'+e+'"/>',this.appendChild(t),this},HTMLElement;
HTMLElement.prototype.soundButton=function(c){return t=document.createElementNS("http://www.w3.org/2000/svg","svg"),t.id="unmute_icon",t.setAttribute("width","100%"),t.setAttribute("height","100%"),t.setAttribute("viewBox","0 0 60 60"),t.innerHTML='<path class="fill_color" style="fill:'+c+'" d="M21.617,24.088l9.547,-7.575c0.151,-0.119 0.356,-0.142 0.529,-0.058c0.172,0.083 0.282,0.258 0.282,0.45l0,25.353c0,0.192 -0.11,0.367 -0.282,0.451c-0.173,0.083 -0.378,0.06 -0.529,-0.059l-9.547,-7.575l-6.367,0c-0.276,0 -0.5,-0.224 -0.5,-0.5l0,-9.987c0,-0.276 0.224,-0.5 0.5,-0.5l6.367,0Z" /><path id="auline1" class="fill_color" style="fill:'+c+'" d="M34.615,24.749c0,0 2.198,1.946 2.198,4.833c0,2.908 -2.219,4.981 -2.219,4.981c-0.403,0.378 -0.423,1.011 -0.045,1.413c0.377,0.403 1.011,0.423 1.413,0.046c0,0 2.851,-2.684 2.851,-6.44c0,-3.779 -2.871,-6.329 -2.871,-6.329c-0.413,-0.366 -1.046,-0.328 -1.412,0.085c-0.366,0.413 -0.328,1.045 0.085,1.411Z" /><path id="auline2" class="fill_color" style="fill:'+c+'" d="M38.857,22.48c0,0 3.212,2.655 3.212,7.102c0,4.47 -3.235,7.304 -3.235,7.304c-0.415,0.363 -0.458,0.995 -0.095,1.411c0.363,0.416 0.995,0.458 1.411,0.095c0,0 3.919,-3.414 3.919,-8.81c0,-5.421 -3.942,-8.647 -3.942,-8.647c-0.426,-0.35 -1.057,-0.289 -1.407,0.138c-0.351,0.426 -0.289,1.057 0.137,1.407Z" />',this.appendChild(t),this};
function loadScriptTo(e,t,n,a){var o=document.createElement("script");o.async=!0,a&&(o.crossOrigin=a),o.src=e,document.getElementsByTagName(t)[0].appendChild(o),o.onload=o.onreadystatechange=function(){o.readyState&&!/complete|loaded/.test(o.readyState)||("function"==typeof n&&n(),o.onload=null,o.onreadystatechange=null)}}
function attachDebugger(x){loadScriptTo("https://cdn.jsdelivr.net/gh/yudopr/GSAPLittleBox@c0a4bf665b700d9f21cdeacf2745b1df0f329a38/gsapDebug.js", "body", x, 'anonymous');}
function log(...x){if(shellParams.isDev)console.log(x)}
function success(...e){if(shellParams.isDev){console.log(`%c${e}`, ["color: #313131","font-size: 12px","padding: 0 5px 0","border-left: 14px solid green","border-bottom: 2px solid green"].join(";"));}}
function warning(...o){if(shellParams.isDev){console.log(`%c${o}`, ["color: #313131","font-size: 12px","padding: 0 5px 0","border-left: 14px solid orange","border-bottom: 2px solid orange"].join(";"));}}
function error(...o){if(shellParams.isDev){console.log(`%c${o}`, ["color: #313131","font-size: 12px","padding: 0 5px 0","border-left: 14px solid #bc1010","border-bottom: 2px solid #bc1010"].join(";"));}}
function clearFaviconErr(){
    let link = document.createElement('link');
    link.setAttribute('rel', 'icon');
    link.setAttribute('href', 'data:,');
    let head = document.getElementsByTagName('head')[0];
    head.insertBefore(link, head.firstChild);
}