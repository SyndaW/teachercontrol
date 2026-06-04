(() => {
    let teachers = [];
    let activeTeacherId = null;

    function anonSession() {
        let id = sessionStorage.getItem('tc_anon');
        if (!id) {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            id = 'žák_' + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            sessionStorage.setItem('tc_anon', id);
        }
        return id;
    }

    function starsText(avg) {
        const full = Math.round(avg);
        return '★'.repeat(full) + '☆'.repeat(5 - full) + ' ' + (avg > 0 ? avg.toFixed(1) : '—');
    }

    function renderSidebar() {
        const list = document.getElementById('teacher-list');
        list.innerHTML = teachers.map(t => `
      <div class="tc-tcard ${t.id === activeTeacherId ? 'active' : ''}" data-id="${t.id}">
        <div class="tc-av" style="color:${t.color};">${t.initials}</div>
        <div class="tc-tinfo">
          <div class="tc-tname">${t.fullName.split(' ')[0]} ${t.fullName.split(' ')[1] ?? ''}</div>
          <div class="tc-tscore">${starsText(t.avgStars)}</div>
        </div>
      </div>`).join('');

        list.querySelectorAll('.tc-tcard').forEach(card => {
            card.addEventListener('click', () => loadTeacher(+card.dataset.id));
        });

        const king = teachers.reduce((best, t) => t.avgStars > (best?.avgStars ?? 0) ? t : best, null);
        const slot = document.getElementById('king-slot');
        if (king && king.reviewCount > 0) {
            slot.innerHTML = `
        <span class="crown">👑</span>
        <div>
          <div class="king-name">${king.fullName.split(' ').slice(0, 2).join(' ')}</div>
          <div class="king-sub">${king.avgStars.toFixed(1)} · ${king.reviewCount} recenzí</div>
        </div>`;
        } else {
            slot.innerHTML = `<div style="font-size:12px;color:#444;font-family:var(--mono);">Zatím nikdo</div>`;
        }
    }

    async function loadTeacher(id) {
        activeTeacherId = id;
        renderSidebar();
        const teacher = teachers.find(t => t.id === id);
        const main = document.getElementById('main-content');
        main.innerHTML = `<div class="loading-msg">Načítám…</div>`;
        await Reviews.render(teacher, main);
        Reviews.setOnReviewAdded(async () => {
            teachers = await API.getTeachers();
            renderSidebar();
        });
    }

    async function init() {
        const anon = anonSession();
        document.getElementById('anon-id').textContent = anon;
        document.getElementById('anon-av').textContent = anon[0].toUpperCase();

        teachers = await API.getTeachers();
        renderSidebar();

        if (teachers.length) loadTeacher(teachers[0].id);
    }

    init().catch(err => {
        document.getElementById('main-content').innerHTML =
            `<div class="loading-msg" style="color:#e02020;">Chyba při načítání: ${err.message}</div>`;
    });
})();