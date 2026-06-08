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
                new Teacher { Id = 1, Initials = "SNJ", FullName = "Jakub Šenkýř", Subject = "Vývoj softwaru", Color = "#4A90E2" },
                new Teacher { Id = 2, Initials = "LAJ", FullName = "Jakub Lattenberg", Subject = "Aplikační software", Color = "#2ECC71" },
                new Teacher { Id = 3, Initials = "SVM", FullName = "Marek Šváb", Subject = "Anglický jazyk, Ekonomika", Color = "#E74C3C" },
                new Teacher { Id = 4, Initials = "KOP", FullName = "Petr Košátko", Subject = "Operační systémy", Color = "#4D5645" },
                new Teacher { Id = 5, Initials = "BAP", FullName = "Pavel Bárta", Subject = "Internet věcí", Color = "#641C34" },
                new Teacher { Id = 6, Initials = "KLJ", FullName = "Jakub Klázar", Subject = "Mechatronika", Color = "#063971" },
                new Teacher { Id = 7, Initials = "PRM", FullName = "Martina Pradáčová", Subject = "Český jazyk a literatura", Color = "#2E3A23" },
                new Teacher { Id = 8, Initials = "LUA", FullName = "Andrea Lukáčková", Subject = "Matematika", Color = "#CAC4B0" },
                new Teacher { Id = 9, Initials = "NAR", FullName = "Radana Návratová", Subject = "Občanská nauka", Color = "#CBD0CC" },
                new Teacher { Id = 10, Initials = "KAM", FullName = "Martin Kádrle", Subject = "Tělesná výchova", Color = "#A12312" },
                new Teacher { Id = 11, Initials = "NYJ", FullName = "Jan Nymš", Subject = "Počítačové sítě", Color = "#CF3476" }
            );
        }
    }
}