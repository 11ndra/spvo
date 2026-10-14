
/** Self-contained safe teaching simulations. No requests, no evaluation of attacker-controlled markup. */
(() => {
  const F = {
    tls: (v) => {
      const encrypted=v.transport==='tls';const wire=v.tap==='wire';
      const observable=!encrypted||!wire;
      return {
        nodes:[['Клиент','GET /records/42','ok'],['Внешний сенсор',encrypted?'TLS application_data':'GET /records/42',encrypted?'warn':'ok'],['Прокси',encrypted?'Завершает TLS; HTTP доступен':'HTTP доступен','ok'],['Приложение','Ответ 403 (учебный пример)','ok']],
        example:wire?(encrypted?'TCP 443 → TLS application_data [ciphertext]':'GET /records/42 HTTP/1.1\nHost: service.test'):(encrypted?'HTTP после TLS-завершения\nGET /records/42 HTTP/1.1':'Открытый HTTP у прокси\nGET /records/42 HTTP/1.1'),
        why:observable?'В выбранной точке виден разобранный HTTP (если средство реально получает данные). Проверить условие по пути технически возможно.':'До TLS-завершения доступны сетевые метаданные и защищённые записи, но не исходный HTTP URI. Правило по http.uri здесь не может проверить этот путь.',
        limit:'Доступность URI не означает, что правило активно, alert появился или операция была успешной. Модель: HTTP/1.1 поверх TCP; ECH может скрывать дополнительные метаданные рукопожатия.',
        expected:observable?'yes':'no',
        explanation:observable?'Да — только при реальном получении и разборе открытого HTTP в этой точке.':'Нет — без открытого HTTP в данной точке конкретный URI для проверки недоступен.'
      };
    },
    http: (v) => {
      const visible=v.visible==='yes',parsed=v.parser==='yes',active=v.rule==='yes';const hit=visible&&parsed&&active;
      return {
        nodes:[['HTTP-запрос','GET /api/orders/12','ok'],['Захват',visible?'Запрос получен':'Пакеты не поступили',visible?'ok':'blocked'],['Разбор',!visible?'Нет данных':parsed?'http.uri извлечён':'Поле не получено',visible&&parsed?'ok':'blocked'],['Правило',hit?'Условие совпало':'Alert не ожидается',hit?'warn':'blocked']],
        example:hit?'eve.json: event_type=alert; signature_id=100012\nhttp.url=/api/orders/12':visible&&parsed?'eve.json: event_type=http; http.url=/api/orders/12\nalert отсутствует в этой модели':'Поля http.uri для проверяемого правила нет',
        why:hit?'В модели на сенсор попал открытый HTTP, анализатор извлёк URI, активное правило совпало. Это достаточные условия для ожидаемого alert при заданных предпосылках.':'Не выполнено хотя бы одно необходимое условие: доставка данных, разбор URI или активное совпадающее правило. Поэтому alert по этому правилу не ожидается.',
        limit:'Alert — не доказательство успешной эксплуатации; отсутствие alert — не доказательство отсутствия запроса или безопасности приложения. Счётчики потерь и журналы проверяются отдельно.',
        expected:hit?'yes':'no',
        explanation:hit?'Да, в оговорённых условиях сработает правило на URI.':'Нет: для этого правила не хватает данных, разбора либо активации.'
      };
    },
    xss: (v) => {
      const payload=v.input==='markup', unsafe=v.sink==='html', interpreted=payload&&unsafe;
      return {
        nodes:[['Ввод',payload?'<img src=x onerror=…>':'Привет, мир','ok'],['Операция',unsafe?'innerHTML ← ввод':'textContent ← ввод',unsafe?'warn':'ok'],['DOM',interpreted?'Создан img-элемент':'Строка остаётся текстом',interpreted?'warn':'ok'],['Итог',interpreted?'Потенциал XSS':'Данный путь безопасен',interpreted?'warn':'ok']],
        example:payload?(unsafe?'sink: element.innerHTML = untrustedValue\nDOM: <img src="x" onerror="…">':'sink: element.textContent = untrustedValue\nDOM: текст «<img src=x onerror=…>»'):(unsafe?'sink: element.innerHTML = "Привет, мир"':'sink: element.textContent = "Привет, мир"'),
        why:interpreted?'Браузер интерпретирует введённую строку как разметку. Элемент с обработчиком может создать путь к выполнению скрипта; реальное выполнение требует проверки в браузере и зависит от CSP/контекста.':unsafe?'innerHTML остаётся опасным sink для недоверенной разметки, но в выбранном примере введён простой текст без HTML-конструкций.':'textContent не интерпретирует строку как HTML. Для этого конкретного места вывода разметка не становится исполняемым содержимым.',
        limit:'Это статическая симуляция DOM. Мы ничего не вставляем через innerHTML и не исполняем код. Ни сетевой alert, ни синтетическая модель не доказывают фактическое выполнение XSS.',
        expected:interpreted?'yes':'no',
        explanation:interpreted?'Да, в данном сочетании браузер разбирал бы эту строку как HTML-элемент.':'Нет, в данном сочетании вредоносная разметка не создаёт HTML-элемент.'
      };
    },
    csrf: (v) => {
      const cookies=v.cookie==='none',check=v.csrf==='on',changed=cookies&&!check;
      return {
        nodes:[['Сторонняя форма','Cross-site POST','warn'],['Cookie',cookies?'Отправлена':'SameSite=Strict: не отправлена',cookies?'warn':'blocked'],['Сервер',!cookies?'Сессия не установлена':check?'CSRF-токен отсутствует':'Проверена только сессия',cookies&&!check?'warn':'blocked'],['Изменение',changed?'Email изменён':'Изменения нет',changed?'warn':'ok']],
        example:(!cookies?'POST /change-email\nCookie: отсутствует → 401':check?'POST /change-email\nCookie: session=…\nCSRF token: отсутствует → 403':'POST /change-email\nCookie: session=…\nCSRF check: нет → 200; изменение зафиксировано'),
        why:changed?'Модель: браузер отправил cookie в межсайтовом POST; сервер принял сессию, не проверил намерение пользователя и выполнил изменение.':!cookies?'SameSite=Strict не даёт приложить cookie при данном межсайтовом POST, поэтому сессия на сервере в этой модели не установлена.':'Cookie приложена, но сервер отверг запрос без корректного CSRF-токена. Сама отправка POST не доказывает изменение.',
        limit:'Модель предполагает HTTPS, cookie SameSite=None;Secure, разрешённые сторонние cookie и обычную HTML-форму. Реальное поведение зависит от браузера, схемы авторизации и других контролей. CORS не равен защите от CSRF.',
        expected:changed?'yes':'no',
        explanation:changed?'Да, в данной модели незащищённое изменение произошло.':'Нет, либо сессия не была отправлена, либо сервер отклонил запрос.'
      };
    },
    bola: (v) => {
      const authorized=v.token==='valid', owns=v.owner==='own', check=v.access==='on';
      const exposed=authorized&&(owns||!check);const violation=authorized&&!owns&&!check;
      return {
        nodes:[['API-клиент',authorized?'JWT user-A':'Неверный JWT',authorized?'ok':'blocked'],['Проверка токена',authorized?'Субъект user-A':'Отклонён: 401',authorized?'ok':'blocked'],['Права на объект',!authorized?'Не выполняется':check?owns?'owner=user-A → разрешено':'owner=user-B → отказ':'Проверка владельца пропущена',!authorized||check&&!owns?'blocked':check?'ok':'warn'],['Ответ',!authorized?'401':exposed?'200 + данные заказа':'403',violation?'warn':exposed?'ok':'blocked']],
        example:!authorized?'GET /api/orders/42 → 401':violation?'GET /api/orders/42\nJWT: sub=user-A; owner=user-B\nHTTP 200 + данные чужого заказа':exposed?'GET /api/orders/42 → 200 + доступ разрешён':'GET /api/orders/42 → 403 (нет права на объект)',
        why:violation?'Токен подлинный, но сервис пропустил проверку права на заказ user-B и выдал содержимое пользователю user-A. В модели это подтверждённое нарушение объектной авторизации.':!authorized?'Неверный токен отклоняется до проверки объекта.':exposed?(check?'Пользователь user-A получает собственный заказ после проверки принадлежности.':'Сервис вернул собственный заказ user-A, но проверка принадлежности отключена; это опасная конфигурация даже без утечки в данном запросе.'):'Проверка принадлежности запрещает доступ к чужому объекту, даже при подлинном JWT.',
        limit:'Ответ 200 сам по себе не доказывает утечку; в уязвимой ветке она показана только потому, что модель отдельно фиксирует выдачу чужих данных. OAuth/OIDC не заменяют объектную авторизацию.',
        expected:violation?'yes':'no',
        explanation:violation?'Да: чужие данные действительно выданы при пропуске объектной проверки.':'Нет: в этом варианте чужие данные не выдаются.'
      };
    }
  };
  function activate(root) {
    root.querySelectorAll('[data-idps-experiment]').forEach(box=>{
      if(box.dataset.idpsReady==='1')return;
      const kind=box.dataset.idpsExperiment, simulate=F[kind];if(!simulate)return;
      box.dataset.idpsReady='1';
      const fields=Array.from(box.querySelectorAll('select[data-field]'));
      const nodes=Array.from(box.querySelectorAll('[data-node-detail]'));
      const observed=box.querySelector('[data-observed]'),why=box.querySelector('[data-why]'),limit=box.querySelector('[data-limit]');
      const feedback=box.querySelector('[data-experiment-feedback]'),answers=Array.from(box.querySelectorAll('button[data-guess]'));
      let state;
      function draw(){
        const params=Object.fromEntries(fields.map(f=>[f.dataset.field,f.value]));
        state=simulate(params);
        nodes.forEach((node,i)=>{node.textContent=state.nodes[i]?.[1]||'';node.closest('li').dataset.state=state.nodes[i]?.[2]||'';});
        if(observed)observed.textContent=state.example;
        if(why)why.textContent=state.why;
        if(limit)limit.textContent=state.limit;
        if(feedback){feedback.textContent='Выберите ответ и проверьте вывод.';delete feedback.dataset.result;}
        answers.forEach(b=>b.setAttribute('aria-pressed','false'));
      }
      fields.forEach(f=>f.addEventListener('change',draw));
      answers.forEach(b=>b.addEventListener('click',()=>{
        answers.forEach(c=>c.setAttribute('aria-pressed',String(c===b)));
        const right=b.dataset.guess===state.expected;
        if(feedback){feedback.dataset.result=right?'right':'wrong';feedback.textContent=(right?'Верно. ':'Не совсем. ')+state.explanation;}
      }));
      draw();
    });
  }
  const mount=()=>activate(document);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
  if(typeof document$!=='undefined' && document$.subscribe) document$.subscribe(mount);
})();
