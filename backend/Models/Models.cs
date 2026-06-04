using System;
using System.Collections.Generic;

namespace TeacherControl.Api.Models;

public class Teacher
{
    public int Id { get; set; }
    public string Initials { get; set; } = "";
    public string FullName { get; set; } = "";
    public string Subject { get; set; } = "";
    public string Color { get; set; } = "#e02020";
    public ICollection<Review> Reviews { get; set; } = [];
    public ICollection<Absence> Absences { get; set; } = [];
}

public class Review
{
    public int Id { get; set; }
    public int TeacherId { get; set; }
    public Teacher Teacher { get; set; } = null!;
    public int Stars { get; set; }
    public string? Text { get; set; }
    public string AnonUser { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<ReviewTag> Tags { get; set; } = [];
}

public class ReviewTag
{
    public int Id { get; set; }
    public int ReviewId { get; set; }
    public Review Review { get; set; } = null!;
    public string Label { get; set; } = "";
    public string Type { get; set; } = "neu"; // pos / neg / neu
}

public class Absence
{
    public int Id { get; set; }
    public int TeacherId { get; set; }
    public Teacher Teacher { get; set; } = null!;
    public DateOnly Date { get; set; }
    public string Kind { get; set; } = "ok"; // ok / late / absent
    public int? MinutesLate { get; set; }
    public string? Mood { get; set; }
}