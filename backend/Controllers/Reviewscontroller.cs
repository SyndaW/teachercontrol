using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeacherControl.Api.Data;
using TeacherControl.Api.DTOs;
using TeacherControl.Api.Models;

namespace TeacherControl.Api.Controllers;

[ApiController]
[Route("api/teachers/{teacherId}/reviews")]
public class ReviewsController(AppDbContext db) : ControllerBase
{
    private static readonly string[] AnonAdjectives = ["rychlý", "tichý", "zvědavý", "statečný", "chytrý", "pilný"];
    private static readonly string[] AnonNouns = ["žák", "student", "rebel", "génius", "analytik", "průzkumník"];

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews(int teacherId, [FromQuery] string sort = "new")
    {
        if (!await db.Teachers.AnyAsync(t => t.Id == teacherId))
            return NotFound();

        var q = db.Reviews
            .Include(r => r.Tags)
            .Where(r => r.TeacherId == teacherId);

        q = sort switch
        {
            "high" => q.OrderByDescending(r => r.Stars).ThenByDescending(r => r.CreatedAt),
            "low" => q.OrderBy(r => r.Stars).ThenByDescending(r => r.CreatedAt),
            _ => q.OrderByDescending(r => r.CreatedAt),
        };

        var reviews = await q.ToListAsync();
        return reviews.Select(MapReview).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<ReviewDto>> Create(int teacherId, CreateReviewRequest req)
    {
        if (!await db.Teachers.AnyAsync(t => t.Id == teacherId))
            return NotFound();

        if (req.Stars is < 1 or > 5)
            return BadRequest("Stars must be 1–5.");

        var rng = Random.Shared;
        var anonUser = $"anon_{AnonAdjectives[rng.Next(AnonAdjectives.Length)]}_{AnonNouns[rng.Next(AnonNouns.Length)]}_{rng.Next(10, 99)}";

        var review = new Review
        {
            TeacherId = teacherId,
            Stars = req.Stars,
            Text = req.Text?.Trim().Length > 0 ? req.Text.Trim() : null,
            AnonUser = anonUser,
            CreatedAt = DateTime.UtcNow,
            Tags = req.Tags.Select(t => new ReviewTag { Label = t.Label, Type = t.Type }).ToList()
        };

        db.Reviews.Add(review);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetReviews), new { teacherId }, MapReview(review));
    }

    private static ReviewDto MapReview(Review r) => new(
        r.Id,
        r.AnonUser,
        r.Stars,
        r.Text,
        FormatDate(r.CreatedAt),
        r.Tags.Select(t => new TagDto(t.Label, t.Type)).ToArray()
    );

    private static string FormatDate(DateTime dt)
    {
        var diff = DateTime.UtcNow - dt;
        if (diff.TotalMinutes < 2) return "právě teď";
        if (diff.TotalMinutes < 60) return $"před {(int)diff.TotalMinutes} min";
        if (diff.TotalHours < 24) return $"dnes {dt.ToLocalTime():HH:mm}";
        if (diff.TotalDays < 2) return "včera";
        return dt.ToLocalTime().ToString("d.M.yyyy");
    }
}