(() => {
  function activate(scope) {
    scope.querySelectorAll('.lesson-model').forEach(model => {
      if (model.dataset.initialized) return;
      model.dataset.initialized = '1';
      const cases = Array.from(model.querySelectorAll('[data-case]'));
      const fact = model.querySelector('[data-model-fact]');
      const conclusion = model.querySelector('[data-model-conclusion]');
      const limit = model.querySelector('[data-model-limit]');
      const context = model.querySelector('[data-model-context]');
      function select(button) {
        cases.forEach(b => {
          const yes = b === button;
          b.setAttribute('aria-pressed', String(yes));
          b.classList.toggle('is-active',yes);
        });
        if (fact) fact.textContent = button.dataset.fact || '';
        if (conclusion) conclusion.textContent = button.dataset.conclusion || '';
        if (limit) limit.textContent = button.dataset.limit || '';
        if (context) context.textContent = button.dataset.context || '';
      }
      cases.forEach(b => b.addEventListener('click',() => select(b)));
      if (cases.length) select(cases[0]);
    });
    scope.querySelectorAll('[data-lesson-mechanism]').forEach(mech => {
      if(mech.dataset.initialized) return;
      mech.dataset.initialized='1';
      const buttons=Array.from(mech.querySelectorAll('[data-mech-step]'));
      const trace=mech.querySelector('[data-mech-trace]');
      const reason=mech.querySelector('[data-mech-reason]');
      const limit=mech.querySelector('[data-mech-limit]');
      function choose(btn){
        buttons.forEach(b => b.setAttribute('aria-pressed',String(b===btn)));
        if(trace) trace.textContent=btn.dataset.trace||'';
        if(reason) reason.textContent=btn.dataset.reason||'';
        if(limit) limit.textContent=btn.dataset.limit||'';
      }
      buttons.forEach(btn=>btn.addEventListener('click',()=>choose(btn)));
      if(buttons.length) choose(buttons[0]);
    });
    scope.querySelectorAll('.lesson-quiz-list').forEach(group => {
      if(group.dataset.shuffled) return;
      group.dataset.shuffled = '1';
      const questions = Array.from(group.querySelectorAll(':scope > .lesson-check'));
      for(let i=questions.length-1;i>0;i--) {
        const j=Math.floor(Math.random()*(i+1));
        [questions[i],questions[j]]=[questions[j],questions[i]];
      }
      questions.forEach(q=>group.appendChild(q));
    });
    scope.querySelectorAll('.lesson-check').forEach(q => {
      if (q.dataset.initialized) return;
      q.dataset.initialized = '1';
      const choices=q.querySelector('.lesson-choicebar');
      const shuffled=Array.from(q.querySelectorAll('button[data-choice]'));
      for(let i=shuffled.length-1;i>0;i--) {
        const j=Math.floor(Math.random()*(i+1));
        [shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];
      }
      shuffled.forEach(b=>choices.appendChild(b));
      const options=Array.from(q.querySelectorAll('button[data-choice]'));
      const response=q.querySelector('[data-feedback]');
      options.forEach(btn => btn.addEventListener('click',() => {
        const correct=btn.dataset.choice === q.dataset.answer;
        options.forEach(o => {
          const selected=o===btn;
          o.classList.toggle('is-selected',selected);
          o.setAttribute('aria-pressed',String(selected));
        });
        if(response) {
          response.textContent=(correct ? 'Верно. ' : 'Неверно. ') + (q.dataset.explanation || '');
          response.dataset.result=correct?'correct':'incorrect';
          q.dataset.lastCorrect=String(correct);
        }
      }));
    });
  }
  const mount=() => activate(document);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount);
  else mount();
  if(typeof document$!=='undefined' && document$.subscribe) document$.subscribe(mount);
})();
