#!/bin/bash
# Vytvoří první EF Core migraci a aplikuje ji na lokální SQLite databázi.
# Spusť z kořene repozitáře.

cd src/TeacherControl.Api

dotnet ef migrations add InitialCreate
dotnet ef database update

echo "✓ Databáze připravena: teachercontrol.db"