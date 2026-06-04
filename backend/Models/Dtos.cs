namespace TeacherControl.Api.DTOs;

public record TeacherDto(
    int Id, string Initials, string FullName, string Subject, string Color,
    double AvgStars, int ReviewCount, int RecommendPct,
    int[] StarDist
);

public record ReviewDto(
    int Id, string AnonUser, int Stars, string? Text,
    string CreatedAt, TagDto[] Tags
);

public record TagDto(string Label, string Type);

public record CreateReviewRequest(
    int Stars,
    string? Text,
    TagDto[] Tags
);

public record AbsenceDto(
    int Id, string Date, string Kind, int? MinutesLate, string? Mood
);

public record CreateAbsenceRequest(
    string Date, string Kind, int? MinutesLate, string? Mood
);