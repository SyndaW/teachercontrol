const API = {
    async getTeachers() {
        const r = await fetch('/api/teachers');
        if (!r.ok) throw new Error('Failed to load teachers');
        return r.json();
    },

    async getReviews(teacherId, sort = 'new') {
        const r = await fetch(`/api/teachers/${teacherId}/reviews?sort=${sort}`);
        if (!r.ok) throw new Error('Failed to load reviews');
        return r.json();
    },

    async createReview(teacherId, payload) {
        const r = await fetch(`/api/teachers/${teacherId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error('Failed to submit review');
        return r.json();
    },

    async getAbsences(teacherId) {
        const r = await fetch(`/api/teachers/${teacherId}/absences`);
        if (!r.ok) throw new Error('Failed to load absences');
        return r.json();
    },

    async createAbsence(teacherId, payload) {
        const r = await fetch(`/api/teachers/${teacherId}/absences`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!r.ok) throw new Error('Failed to submit absence');
        return r.json();
    },
};