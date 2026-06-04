using Microsoft.EntityFrameworkCore;
using TeacherControl.Api.Models;

namespace TeacherControl.Api.Data
{
    public class AppDbContext : DbContext
    {
        // Tento konstruktor opraví chybu 'AddDbContext'
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Teacher> Teachers => Set<Teacher>();
        public DbSet<Review> Reviews => Set<Review>();
        public DbSet<ReviewTag> ReviewTags => Set<ReviewTag>();
        public DbSet<Absence> Absences => Set<Absence>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Generování testovacích učitelů, které tvůj frontend hned vykreslí
            modelBuilder.Entity<Teacher>().HasData(
                new Teacher { Id = 1, Initials = "JN", FullName = "Mgr. Jan Novák", Subject = "Matematika", Color = "#4A90E2" },
                new Teacher { Id = 2, Initials = "MC", FullName = "Ing. Marie Černá", Subject = "Informatika", Color = "#2ECC71" },
                new Teacher { Id = 3, Initials = "PS", FullName = "PhDr. Petr Svoboda", Subject = "Dějepis", Color = "#E74C3C" }
            );
        }
    }
}