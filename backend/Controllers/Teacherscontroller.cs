using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeacherControl.Api.Data;
using TeacherControl.Api.DTOs;
using TeacherControl.Api.Models;

namespace TeacherControl.Api.Controllers;

[ApiController]
[Route("api/teachers")]
public class TeachersController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<TeacherDto>> GetAll()
    {
        var teachers = await db.Teachers
            .Include(t => t.Reviews)
            .ThenInclude(r => r.Tags)
            .ToListAsync();

        return teachers.Select(Map);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeacherDto>> Get(int id)
    {
        var t = await db.Teachers
            .Include(t => t.Reviews).ThenInclude(r => r.Tags)
            .FirstOrDefaultAsync(t => t.Id == id);

        return t is null ? NotFound() : Map(t);
    }

    private static TeacherDto Map(Teacher t)
    {
        var reviews = t.Reviews.ToList();
        double avg = reviews.Count > 0 ? reviews.Average(r => r.Stars) : 0;
        int recPct = reviews.Count > 0
            ? (int)Math.Round(reviews.Count(r => r.Stars >= 4) * 100.0 / reviews.Count)
            : 0;
        var dist = Enumerable.Range(1, 5)
            .Select(n => reviews.Count(r => r.Stars == n))
            .ToArray();

        return new TeacherDto(
            t.Id, t.Initials, t.FullName, t.Subject, t.Color,
            Math.Round(avg, 1), reviews.Count, recPct, dist
        );
    }
}