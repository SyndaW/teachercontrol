const Reviews = (() => {
    const TAGS = [
        { label: 'spravedlivý', type: 'pos' },
        { label: 'vysvětluje dobře', type: 'pos' },
        { label: 'zábavný', type: 'pos' },
        { label: 'doporučuji', type: 'pos' },
        { label: 'přísný', type: 'neg' },
        { label: 'těžké testy', type: 'neg' },
        { label: 'pozdní příchody', type: 'neg' },
        { label: 'špatná nálada', type: 'neg' },
        { label: 'přísný ale fér', type: 'neu' },
        { label: 'hodně DÚ', type: 'neu' },
    ];

    let selectedStars = 0;
    let selectedTags = [];
    let currentSort = 'new';
    let currentTeacherId = null;
    let onReviewAdded = null;

    function starsHtml(n, total = 5) {
        return Array.from({ length: total }, (_, i) =>
            `<span class="${i < n ? '' : 'off'}">★</span>`
        ).join('');
    }

    function renderDist(dist) {
        const max = Math.max(...dist, 1);
        [1, 2, 3, 4, 5].forEach(n => {
            const el = document.getElementById(`d${n}`);
            const cnt = document.getElementById(`dc${n}`);
            if (!el || !cnt) return;
            const val = dist[n - 1] ?? 0;
            el.style.width = Math.round(val / max * 100) + '%';
            cnt.textContent = val;
        });
    }

    function renderMetrics(teacher, reviews) {
        const avg = reviews.length
            ? (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1)
            : '—';
        const recPct = reviews.length
            ? Math.round(reviews.filter(r => r.stars >= 4).length / reviews.length * 100) + '%'
            : '—';

        const ovrEl = document.getElementById('met-ovr');
        if (ovrEl) ovrEl.innerHTML = avg !== '—' ? `${avg}<small>/5</small>` : '—';

        const cntEl = document.getElementById('met-count');
        if (cntEl) cntEl.textContent = reviews.length;

        const recEl = document.getElementById('met-rec');
        if (recEl) {
            recEl.textContent = recPct;
            const pctNum = reviews.length ? parseInt(recPct) : -1;
            recEl.style.color = pctNum >= 60 ? '#20a020' : pctNum >= 40 ? '#f0a020' : '#e02020';
        }

        const dist = [1, 2, 3, 4, 5].map(n => reviews.filter(r => r.stars === n).length);
        renderDist(dist);
    }

    function reviewCard(r) {
        const tagHtml = r.tags.map(t =>
            `<span class="rev-tag ${t.type}">${t.label}</span>`
        ).join('');
        return `
      <div class="rev-card">
        <div class="rev-hdr">
          <span class="rev-user">${r.anonUser}</span>
          <span class="stars-s">${starsHtml(r.stars)}</span>
          <span class="rev-date">${r.createdAt}</span>
        </div>
        ${r.text ? `<div class="rev-text">${r.text}</div>` : ''}
        ${tagHtml ? `<div class="rev-tags">${tagHtml}</div>` : ''}
      </div>`;
    }

    async function loadAndRenderReviews(teacherId) {
        currentTeacherId = teacherId;
        const reviews = await API.getReviews(teacherId, currentSort);
        const list = document.getElementById('rev-list');
        if (!list) return reviews;
        list.innerHTML = reviews.length
            ? reviews.map(reviewCard).join('')
            : `<div class="rev-empty">Zatím žádné recenze · buď první!</div>`;
        return reviews;
    }

    function buildFormHtml() {
        const tagHtml = TAGS.map(t =>
            `<span class="tp-tag" data-type="${t.type}" data-label="${t.label}">${t.label}</span>`
        ).join('');

        return `
      <div class="sec-title">Přidat recenzi</div>
      <div class="form-box">
        <div style="display:flex;align-items:center;gap:0;margin-bottom:12px;">
          <span class="form-label" style="margin-bottom:0;min-width:80px;">Hodnocení</span>
          <div class="star-picker" id="star-picker">
            ${[1, 2, 3, 4, 5].map(v => `<span class="sp" data-v="${v}">★</span>`).join('')}
          </div>
          <span class="star-label" id="star-label">nevybráno</span>
        </div>
        <div style="margin-bottom:10px;">
          <span class="form-label">Tagy</span>
          <div class="tag-picker" id="tag-picker">${tagHtml}</div>
        </div>
        <div style="margin-bottom:12px;">
          <span class="form-label">Komentář (volitelný)</span>
          <textarea class="tc-textarea" id="rev-text" rows="3" placeholder="Napiš cokoliv anonymně…"></textarea>
        </div>
        <div class="form-actions">
          <button class="tc-btn" id="submit-btn" disabled>Odeslat anonymně</button>
          <button class="tc-btn-ghost" id="cancel-btn">Zrušit</button>
          <span class="anon-note">100% anon · žádné IP</span>
        </div>
      </div>`;
    }

    function bindForm(teacherId, onSuccess) {
        selectedStars = 0;
        selectedTags = [];

        const stars = document.querySelectorAll('.sp');
        const starLabel = document.getElementById('star-label');
        const submitBtn = document.getElementById('submit-btn');

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const v = +star.dataset.v;
                stars.forEach(s => s.style.color = +s.dataset.v <= v ? '#e02020' : '#333');
            });
            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.style.color = +s.dataset.v <= selectedStars ? '#e02020' : '#333');
            });
            star.addEventListener('click', () => {
                selectedStars = +star.dataset.v;
                stars.forEach(s => s.classList.toggle('sel', +s.dataset.v <= selectedStars));
                starLabel.textContent = `${selectedStars}/5`;
                submitBtn.disabled = false;
            });
        });

        document.querySelectorAll('.tp-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const label = tag.dataset.label;
                const type = tag.dataset.type;
                const idx = selectedTags.findIndex(t => t.label === label);
                if (idx > -1) {
                    selectedTags.splice(idx, 1);
                    tag.className = 'tp-tag';
                } else {
                    selectedTags.push({ label, type });
                    tag.className = `tp-tag sel-${type}`;
                }
            });
        });

        submitBtn.addEventListener('click', async () => {
            if (!selectedStars) return;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Odesílám…';
            try {
                const text = document.getElementById('rev-text').value.trim();
                await API.createReview(teacherId, {
                    stars: selectedStars,
                    text: text || null,
                    tags: selectedTags,
                });
                onSuccess();
            } catch {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Odeslat anonymně';
            }
        });

        document.getElementById('cancel-btn').addEventListener('click', () => onSuccess(true));
    }

    function profileHtml(teacher) {
        return `
      <div class="tc-ph">
        <div class="tc-av-lg" style="color:${teacher.color};">${teacher.initials}</div>
        <div style="flex:1;">
          <div class="tc-pname">${teacher.fullName}</div>
          <div class="tc-psub">${teacher.subject}</div>
          <div class="tc-tags" id="prof-tags"></div>
        </div>
        <button class="tc-btn" id="open-form-btn">+ Recenzovat</button>
      </div>

      <div class="tc-metrics">
        <div class="tc-met">
          <div class="tc-mlabel">Celkové OVR</div>
          <div class="tc-mval red" id="met-ovr">—</div>
        </div>
        <div class="tc-met">
          <div class="tc-mlabel">Recenzí</div>
          <div class="tc-mval" id="met-count">0</div>
        </div>
        <div class="tc-met">
          <div class="tc-mlabel">Doporučuje</div>
          <div class="tc-mval" id="met-rec">—</div>
        </div>
        <div class="tc-met">
          <div class="tc-mlabel">Hodnocení</div>
          <div style="margin-top:4px;">
            ${[5, 4, 3, 2, 1].map(n => `
              <div class="dist-bar">
                <span class="dist-label">${n}</span>
                <div class="dist-track"><div class="dist-fill" id="d${n}" style="width:0%;"></div></div>
                <span class="dist-count" id="dc${n}">0</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div id="flash-wrap"></div>
      <div id="form-insert"></div>

      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <div class="sec-title" style="flex:1;margin-bottom:0;">Recenze</div>
        <div class="sort-row" style="margin-bottom:0;">
          <button class="sort-btn active" data-sort="new">Nejnovější</button>
          <button class="sort-btn" data-sort="high">Nejlepší</button>
          <button class="sort-btn" data-sort="low">Nejhorší</button>
        </div>
      </div>
      <div class="rev-list" id="rev-list"></div>`;
    }

    async function render(teacher, container) {
        currentTeacherId = teacher.id;
        currentSort = 'new';
        container.innerHTML = profileHtml(teacher);

        const reviews = await loadAndRenderReviews(teacher.id);
        renderMetrics(teacher, reviews);

        document.getElementById('open-form-btn').addEventListener('click', () => {
            const insert = document.getElementById('form-insert');
            if (insert.innerHTML) { insert.innerHTML = ''; return; }
            insert.innerHTML = buildFormHtml();
            bindForm(teacher.id, async (cancelled) => {
                insert.innerHTML = '';
                if (!cancelled) {
                    const flash = document.getElementById('flash-wrap');
                    flash.innerHTML = `<div class="success-flash">✓ Recenze přidána anonymně.</div>`;
                    setTimeout(() => flash.innerHTML = '', 3000);
                }
                const fresh = await loadAndRenderReviews(teacher.id);
                renderMetrics(teacher, fresh);
                if (onReviewAdded) onReviewAdded();
            });
        });

        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                currentSort = btn.dataset.sort;
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                await loadAndRenderReviews(teacher.id);
            });
        });
    }

    return { render, starsHtml, setOnReviewAdded: fn => onReviewAdded = fn };
})();