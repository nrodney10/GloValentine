document.addEventListener('DOMContentLoaded',()=>{
  document.body.classList.add('loaded');

  const startBtn = document.getElementById('start-btn');
  const overlay = document.getElementById('start-overlay');
  const music = document.getElementById('bg-music');
  const modal = document.getElementById('question-modal');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const final = document.getElementById('final');
  const video = document.getElementById('proposal-video');
  const countdownLabel = document.getElementById('countdown-label');
  const countdownValue = document.getElementById('countdown-value');
  const finalPlayBtn = document.getElementById('final-play');
  const finalMode = document.getElementById('final-mode');
  const finalExitBtn = document.getElementById('final-exit');

  const slidesContainer = document.getElementById('slides');
  const finalSlidesContainer = document.getElementById('final-slides');
  const buttonsWrap = document.querySelector('.modal-buttons');

  const MAX_TRIES = 50;
  const IMAGE_BASES = ['valepic', 'assets/images'];
  const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  let slideImgs = [];
  let finalSlideImgs = [];
  let current = 0;

  function addSlide(container,list,img){
    if(!container) return;
    container.appendChild(img);
    list.push(img);
    if(list.length===1){ img.classList.add('active'); }
  }

  function registerSlide(img){
    img.classList.add('slide-img');
    addSlide(slidesContainer, slideImgs, img);
    if(finalSlidesContainer){
      const clone = img.cloneNode();
      clone.classList.add('slide-img');
      addSlide(finalSlidesContainer, finalSlideImgs, clone);
    }
  }

  function loadFirstAvailableImage(candidates){
    if(candidates.length===0) return;
    const img = new Image();
    let idx = 0;
    const tryNext = ()=>{
      if(idx >= candidates.length) return;
      img.src = candidates[idx++];
    };
    img.onload = ()=>{ registerSlide(img); };
    img.onerror = ()=>{ tryNext(); };
    tryNext();
  }

  const wantsSlides = !!(slidesContainer || finalSlidesContainer);
  if(wantsSlides){
    for(let i=1;i<=MAX_TRIES;i++){
      const candidates = [];
      IMAGE_BASES.forEach((base)=>{
        IMAGE_EXTS.forEach((ext)=>{
          candidates.push(`${base}/photo${i}.${ext}`);
        });
      });
      loadFirstAvailableImage(candidates);
    }
  }

  function showSlide(idx){
    if(slideImgs.length===0) return;
    const safeIdx = ((idx % slideImgs.length) + slideImgs.length) % slideImgs.length;
    slideImgs.forEach((im,i)=>im.classList.toggle('active', i===safeIdx));
    finalSlideImgs.forEach((im,i)=>im.classList.toggle('active', i===safeIdx));
  }

  function goSlide(delta){
    if(slideImgs.length===0) return;
    current = (current + delta + slideImgs.length) % slideImgs.length;
    showSlide(current);
  }

  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const finalPrevBtn = document.getElementById('final-prev');
  const finalNextBtn = document.getElementById('final-next');

  if(prevBtn){ prevBtn.addEventListener('click',()=>goSlide(-1)); }
  if(nextBtn){ nextBtn.addEventListener('click',()=>goSlide(1)); }
  if(finalPrevBtn){ finalPrevBtn.addEventListener('click',()=>goSlide(-1)); }
  if(finalNextBtn){ finalNextBtn.addEventListener('click',()=>goSlide(1)); }

  if(wantsSlides){
    setInterval(()=>{
      if(slideImgs.length>0){
        current = (current+1) % slideImgs.length;
        showSlide(current);
      }
    },5000);
  }

  function getValentinesInfo(now){
    const year = now.getFullYear();
    const start = new Date(year,1,14,0,0,0,0);
    const end = new Date(year,1,15,0,0,0,0);
    if(now >= end){
      return { target: new Date(year+1,1,14,0,0,0,0), isToday: false };
    }
    if(now >= start){
      return { target: start, isToday: true };
    }
    return { target: start, isToday: false };
  }

  function updateCountdown(){
    if(!countdownValue) return;
    const now = new Date();
    const info = getValentinesInfo(now);
    if(info.isToday){
      if(countdownLabel) countdownLabel.textContent = "Valentine's Day is";
      countdownValue.textContent = "today";
      return;
    }
    if(countdownLabel) countdownLabel.textContent = "Valentine's Day in";
    const diff = Math.max(0, info.target - now);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    countdownValue.textContent = `${days}d ${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m ${String(seconds).padStart(2,'0')}s`;
  }

  updateCountdown();
  setInterval(updateCountdown,1000);

  const steps = Array.from(document.querySelectorAll('[data-step]'));
  const stepPrevBtn = document.getElementById('step-prev');
  const stepNextBtn = document.getElementById('step-next');
  const stepLabel = document.getElementById('step-label');
  const stepTabs = Array.from(document.querySelectorAll('[data-step-btn]'));
  let stepIndex = 0;
  let experienceStarted = false;
  let modalShown = false;

  function updateStepUI(){
    if(steps.length===0) return;
    steps.forEach((step,i)=>step.classList.toggle('active', i===stepIndex));
    const activeStep = steps[stepIndex];
    const label = activeStep?.dataset.stepLabel || activeStep?.dataset.step || '';
    if(stepLabel){
      stepLabel.textContent = `Step ${stepIndex+1} of ${steps.length} · ${label}`;
    }
    if(stepPrevBtn){ stepPrevBtn.disabled = stepIndex===0; }
    if(stepNextBtn){ stepNextBtn.disabled = stepIndex===steps.length-1; }
    if(stepTabs.length){
      const activeKey = activeStep?.dataset.step || '';
      stepTabs.forEach((btn)=>btn.classList.toggle('active', btn.dataset.stepBtn === activeKey));
    }
    if(experienceStarted && !modalShown && activeStep?.dataset.step === 'letter' && modal){
      modal.classList.remove('hidden');
      modalShown = true;
    }
  }

  function goStep(delta){
    if(steps.length===0) return;
    const nextIndex = Math.min(steps.length-1, Math.max(0, stepIndex + delta));
    if(nextIndex !== stepIndex){
      stepIndex = nextIndex;
      updateStepUI();
    }
  }

  if(stepPrevBtn){ stepPrevBtn.addEventListener('click',()=>goStep(-1)); }
  if(stepNextBtn){ stepNextBtn.addEventListener('click',()=>goStep(1)); }
  if(stepTabs.length){
    stepTabs.forEach((btn)=>{
      btn.addEventListener('click',()=>{
        const idx = steps.findIndex((step)=>step.dataset.step === btn.dataset.stepBtn);
        if(idx >= 0){
          stepIndex = idx;
          updateStepUI();
        }
      });
    });
  }

  updateStepUI();

  if(startBtn && overlay){
    startBtn.addEventListener('click',async()=>{
      overlay.classList.add('hidden');
      experienceStarted = true;
      if(music){
        try{ await music.play(); }catch(e){}
      }
      updateStepUI();
    });
  }

  function moveNoButtonRandom(){
    if(!buttonsWrap || !noBtn) return;
    const wrapRect = buttonsWrap.getBoundingClientRect();
    const maxX = Math.max(0, wrapRect.width - noBtn.offsetWidth - 12);
    const maxY = Math.max(0, wrapRect.height - noBtn.offsetHeight - 12);
    const x = Math.floor(Math.random() * (maxX + 1));
    const y = Math.floor(Math.random() * (maxY + 1));
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
  }

  let noScale = 1;
  function shrinkNoButton(){
    noScale = Math.max(0.45, noScale - 0.08);
    noBtn.style.transform = `scale(${noScale})`;
  }

  function dodgeNo(){
    shrinkNoButton();
    moveNoButtonRandom();
  }

  if(noBtn){
    noBtn.addEventListener('mouseenter',dodgeNo);
    noBtn.addEventListener('click',(e)=>{ e.preventDefault(); dodgeNo(); });
    noBtn.addEventListener('touchstart',dodgeNo,{passive:true});
  }

  if(yesBtn){
    yesBtn.addEventListener('click',()=>{
      if(modal){ modal.classList.add('hidden'); }
      if(final){
        final.classList.remove('hidden');
        final.setAttribute('aria-hidden','false');
        final.scrollIntoView({behavior:'smooth',block:'center'});
      }
      if(video){
        try{ video.play(); }catch(e){}
      }
    });
  }

  function openFinalMode(){
    if(!finalMode) return;
    finalMode.classList.remove('hidden');
    finalMode.setAttribute('aria-hidden','false');
    if(music){
      try{ music.play(); }catch(e){}
    }
  }

  function closeFinalMode(){
    if(!finalMode) return;
    finalMode.classList.add('hidden');
    finalMode.setAttribute('aria-hidden','true');
  }

  if(finalPlayBtn){
    finalPlayBtn.addEventListener('click',openFinalMode);
  }
  if(finalExitBtn){
    finalExitBtn.addEventListener('click',closeFinalMode);
  }
  if(finalMode){
    finalMode.addEventListener('click',(e)=>{
      if(e.target === finalMode){ closeFinalMode(); }
    });
  }
  document.addEventListener('keydown',(e)=>{
    if(e.key === 'Escape' && finalMode && !finalMode.classList.contains('hidden')){
      closeFinalMode();
    }
  });
});
