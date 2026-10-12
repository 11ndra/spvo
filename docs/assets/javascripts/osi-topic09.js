(() => {
  const WRAP = {
    app: { chunks: [['HTTP', 'GET /catalog HTTP/1.1']], title: 'Прикладное представление', text: 'Приложение создаёт HTTP-запрос. Сам по себе этот текст ещё не является Ethernet-кадром.' },
    tcp: { chunks: [['TCP', 'src_port → 8080'], ['HTTP', 'GET /catalog HTTP/1.1']], title: 'Транспортное представление', text: 'TCP добавляет транспортные сведения для доставки потока байтов. Один HTTP-запрос может пересекать границы нескольких сегментов.' },
    ip: { chunks: [['IP', '10.13.37.10 → 10.13.37.20'], ['TCP', 'src_port → 8080'], ['HTTP', 'GET /catalog HTTP/1.1']], title: 'Сетевое представление', text: 'IP добавляет логические адреса и информацию для передачи между сетями. IP-пакеты не обязаны совпадать с целыми HTTP-сообщениями.' },
    eth: { chunks: [['Ethernet', 'MAC отправителя → MAC следующего узла'], ['IP', '10.13.37.10 → 10.13.37.20'], ['TCP', 'src_port → 8080'], ['HTTP', 'GET /catalog HTTP/1.1']], title: 'Канальное представление', text: 'Ethernet-кадр содержит сетевой пакет. На другом канальном участке могут использоваться другие MAC-адреса и другая канальная технология.' }
  };
  const OBS = {
    l2: { trace: 'Ethernet: src MAC → dst MAC · EtherType: IPv4', supported: 'В точке захвата доступен кадр с указанными канальными полями.', limit: 'Что прикладной запрос был успешно выполнен или что источник кадра — конечный автор запроса.' },
    l3: { trace: 'IP: 10.13.37.10 → 10.13.37.20 · protocol: TCP', supported: 'В захваченном IP-пакете указаны эти адреса и транспортный протокол.', limit: 'Что IP-адрес однозначно идентифицирует пользователя и что HTTP был распознан.' },
    l4: { trace: 'TCP: client ephemeral port → 8080 · flags / sequence', supported: 'Видны транспортные параметры конкретного обмена в точке наблюдения.', limit: 'Что приложение ответило на запрос или что сетевой порт доказывает HTTP-семантику.' },
    l7: { trace: 'HTTP (без TLS): GET /catalog HTTP/1.1', supported: 'При достаточном захвате и корректном разборе доступен метод и путь запроса.', limit: 'Что запрос завершился успешно, пользователь авторизован или атака действительно произошла.' }
  };
  function el(tag, className, value) {
    const n = document.createElement(tag);
    n.className = className;
    n.textContent = value;
    return n;
  }
  function init(root) {
    if (root.dataset.osi9Ready === 'true') return;
    root.dataset.osi9Ready = 'true';
    const wrapping = root.dataset.osi9 === 'wrap';
    const buttons = Array.from(root.querySelectorAll(wrapping ? '[data-osi9-step]' : '[data-osi9-layer]'));
    function render(key) {
      buttons.forEach(b => b.setAttribute('aria-pressed', String((wrapping ? b.dataset.osi9Step : b.dataset.osi9Layer) === key)));
      if (wrapping) {
        const data = WRAP[key];
        const payload = root.querySelector('.osi9-payload');
        payload.replaceChildren(...data.chunks.map(([label, value], i) => {
          const chunk = el('div', 'osi9-chunk osi9-chunk--' + label.toLowerCase(), '');
          chunk.appendChild(el('strong', 'osi9-chunk-label', label));
          chunk.appendChild(el('span', 'osi9-chunk-value', value));
          return chunk;
        }));
        root.querySelector('.osi9-title').textContent = data.title;
        root.querySelector('.osi9-detail').textContent = data.text;
      } else {
        const data = OBS[key];
        root.querySelector('.osi9-trace-value').textContent = data.trace;
        root.querySelector('.osi9-supported').textContent = data.supported;
        root.querySelector('.osi9-limit').textContent = data.limit;
      }
    }
    buttons.forEach(b => b.addEventListener('click', () => render(wrapping ? b.dataset.osi9Step : b.dataset.osi9Layer)));
    render(wrapping ? 'app' : 'l2');
  }
  function initAll() { document.querySelectorAll('[data-osi9]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initAll);
  else initAll();
  if (typeof document$ !== 'undefined' && document$ && typeof document$.subscribe === 'function') document$.subscribe(initAll);
})();
