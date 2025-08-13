# EBS Key Management System

Een moderne, veilige sleutelbeheer applicatie gebouwd met React, TypeScript, Supabase en Electron.

## ✨ Functies

### 🔐 Authenticatie & Beveiliging
- Volledige gebruikersregistratie en login systeem
- Veilige wachtwoord authenticatie via Supabase
- Row Level Security (RLS) voor database beveiliging
- Gebruikerssessie beheer

### 👥 Medewerker Beheer
- Toevoegen, bewerken en verwijderen van medewerkers
- CAO en MBV medewerker types
- Automatische berekening van dienstjaren
- Zoekfunctionaliteit
- Gedetailleerde werknemersgeschiedenis

### 🔑 Sleutel Beheer
- Verschillende sleutel types (A, B, C) met kort/lang lengtes
- Real-time status tracking (beschikbaar/uitgegeven)
- Sleutels uitgeven aan medewerkers
- Sleutels inleveren met notities
- Opmerkingen per sleutel

### 📊 Dashboard & Rapportage
- Real-time statistieken en overzichten
- Recente transacties weergave
- Sleutel status overzicht
- Medewerker statistieken

### 📈 Transactie Beheer
- Complete transactiegeschiedenis
- Filter op actie type en datum
- Tracking van wie transacties heeft afgehandeld
- Gedetailleerde notities per transactie

### 🎨 Design & UX
- Moderne groene en oranje kleurenschema
- Responsive design voor alle schermformaten
- Smooth animaties en hover effecten
- Intuïtieve navigatie

## 🚀 Installatie & Setup

### Vereisten
- Node.js 18+ 
- npm of yarn
- Supabase account

### 1. Project Clonen
```bash
git clone <repository-url>
cd ebs-key-management
npm install
```

### 2. Database Setup (Supabase)

1. Maak een nieuw Supabase project aan op [supabase.com](https://supabase.com)
2. Ga naar SQL Editor in je Supabase dashboard
3. Voer de SQL uit vanuit `supabase/migrations/create_tables.sql`
4. Kopieer je project URL en anon key

### 3. Environment Variabelen
```bash
cp .env.example .env
```

Vul je Supabase gegevens in:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Applicatie Starten

#### Web Versie
```bash
npm run dev
```

#### Desktop Versie (Electron)
```bash
npm run electron:dev
```

## 📦 Bouwen voor Productie

### Web Applicatie
```bash
npm run build
```

### Desktop Applicatie
```bash
# Voor alle platforms
npm run electron:build

# Alleen bouwen (zonder distributie)
npm run electron:dist
```

Dit genereert uitvoerbare bestanden in de `dist-electron` map voor:
- Windows (.exe)
- macOS (.dmg)
- Linux (.AppImage)

## 🗄️ Database Schema

### Tabellen
- **employees**: Medewerker informatie
- **keys**: Sleutel informatie en status
- **transactions**: Transactie geschiedenis

### Beveiliging
- Row Level Security (RLS) ingeschakeld
- Alleen geauthenticeerde gebruikers hebben toegang
- Automatische timestamps en triggers

## 🛠️ Technologie Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Desktop**: Electron
- **Icons**: Lucide React
- **Build**: Vite
- **Styling**: Tailwind CSS met custom animaties

## 📱 Platform Support

- **Web**: Alle moderne browsers
- **Desktop**: Windows, macOS, Linux
- **Mobile**: Responsive web interface

## 🔒 Beveiliging

- Supabase authenticatie met JWT tokens
- Row Level Security op database niveau
- HTTPS verplicht in productie
- Geen gevoelige data in frontend code

## 🤝 Bijdragen

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je wijzigingen (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request

## 📄 Licentie

Dit project is gelicenseerd onder de MIT Licentie - zie het [LICENSE](LICENSE) bestand voor details.

## 🆘 Support

Voor vragen of problemen, open een issue in de GitHub repository of neem contact op met het ontwikkelteam.