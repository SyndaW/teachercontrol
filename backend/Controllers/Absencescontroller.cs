using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeacherControl.Api.Data;
using TeacherControl.Api.DTOs;
using TeacherControl.Api.Models;

namespace TeacherControl.Api.Controllers;

[ApiController]
[Route("api/teachers/{teacherId}/absences")]
public class AbsencesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AbsenceDto>>> Get(int teacherId)
    {
        if (!await db.Teachers.AnyAsync(t => t.Id == teacherId))
            return NotFound();

        var absences = await db.Absences
            .Where(a => a.TeacherId == teacherId)
            .OrderByDescending(a => a.Date)
            .ToListAsync();

        return absences.Select(Map).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<AbsenceDto>> Create(int teacherId, CreateAbsenceRequest req)
    {
        if (!await db.Teachers.AnyAsync(t => t.Id == teacherId))
            return NotFound();

        if (!DateOnly.TryParse(req.Date, out var date))
            return BadRequest("Invalid date format. Use yyyy-MM-dd.");

        var absence = new Absence
        {
            TeacherId = teacherId,
            Date = date,
            Kind = req.Kind,
            MinutesLate = req.MinutesLate,
            Mood = req.Mood
        };

        db.Absences.Add(absence);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { teacherId }, Map(absence));
    }

    private static AbsenceDto Map(Absence a) => new(
        a.Id,
        a.Date.ToString("d.M.yyyy"),
        a.Kind,
        a.MinutesLate,
        a.Mood
    );
}