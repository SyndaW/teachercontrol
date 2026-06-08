# TeacherControl
**Reverzní Bakaláři** — anonymní hodnocení učitelů pro studenty.

## Stack
- **Backend**: ASP.NET Core 8 Web API (C#)
- **Databáze**: SQLite přes Entity Framework Core
- **Frontend**: Vanilla HTML/CSS/JS servovaný přímo z ASP.NET (`wwwroot/`)

## Funkce
- [x] Profily učitelů s průměrným hodnocením
- [x] Anonymní recenze s hvězdičkami, tagy a komentářem
- [x] Distribuce hodnocení, % doporučujících
- [ ] Drbárna (live chat)
- [ ] Absence & nálada metr
- [ ] Bingo kartičky
- [ ] Hlasování (pololetní)
- [ ] Žebříček

## Spuštění

### Požadavky
- [.NET 8 SDK](https://dotnet.microsoft.com/download)

### Instalace

```bash
# 1. Naklonuj repozitář
git clone https://github.com/<tvůj-nick>/teachercontrol.git
cd teachercontrol

# 2. Vytvoř databázi (poprvé)
chmod +x migrate.sh
./migrate.sh

# 3. Spusť aplikaci
cd src/TeacherControl.Api
dotnet run
```

Otevři **http://localhost:5000** v prohlížeči.

### Ruční migrace (alternativa)

```bash
cd src/TeacherControl.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

## Struktura projektu

```
teachercontrol/
├── src/
│   └── TeacherControl.Api/
│       ├── Controllers/          # REST API endpointy
│       │   ├── TeachersController.cs
│       │   ├── ReviewsController.cs
│       │   └── AbsencesController.cs
│       ├── Data/
│       │   └── AppDbContext.cs   # EF Core DbContext + seed data
│       ├── DTOs/
│       │   └── Dtos.cs           # Request/response modely
│       ├── Models/
│       │   └── Models.cs         # Databázové entity
│       ├── wwwroot/              # Frontend (statické soubory)
│       │   ├── index.html
│       │   ├── css/app.css
│       │   └── js/
│       │       ├── api.js        # Fetch wrapper pro backend
│       │       ├── reviews.js    # Reviews UI modul
│       │       └── app.js        # Hlavní app bootstrap
│       ├── Program.cs
│       └── appsettings.json
├── migrate.sh
└── README.md
```

## API Endpointy

| Metoda | URL | Popis |
|--------|-----|-------|
| GET | `/api/teachers` | Seznam všech učitelů s průměry |
| GET | `/api/teachers/{id}` | Detail jednoho učitele |
| GET | `/api/teachers/{id}/reviews?sort=new\|high\|low` | Recenze učitele |
| POST | `/api/teachers/{id}/reviews` | Přidat recenzi |
| GET | `/api/teachers/{id}/absences` | Absence učitele |
| POST | `/api/teachers/{id}/absences` | Přidat absenci |

## Podmínky použití
Slušně · Spořádaně · S úctou · Anonymně.

---
MIT License © 2026 Vojtěch Synáč, Hanák, Žák

## Osobní názor
Můj názor na tuto aplikaci je pozitivní, myslím si, že je to zábavná aplikace pro žáky našeho věku,
která nám umožní anonymně hodnotit naše učitele. Jediný problém který vidím je možná to, že by možná bylo moc
práce pro 6 skupin. Možná ještě bude lepší přidat i další featury.