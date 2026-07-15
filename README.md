# 🤖 Discord / GitHub Coach Bot — Craft Integration

Automatisierter Coach-Bot der Discord, GitHub und Craft Daily Notes verbindet.

## Features

- ✅ Tägliche Discord Check-ins → Craft Daily Notes
- ✅ Task-Status via `!done`, `!today`, `!checkin`
- ✅ GitHub PR/Issue Events → Craft Notizen
- ✅ GitHub Actions Daily Summary
- ✅ Fly.io Deployment (Frankfurt)
- ✅ Optionaler eigener MCP Server

## Datenfluss

```
Discord User
    ↓ (!checkin)
Discord Bot
    ↓ (API Call)
Backend Server
    ↓ (liest/schreibt)
Craft Daily Notes API
    ↑ (synchronisiert)
GitHub Actions
```

## Quickstart

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. .env befüllen (siehe .env.example)
cp .env.example .env

# 3. Lokal starten
npm run dev

# 4. In Discord testen
!checkin Heute HUB-07 fertiggestellt
!today
!done <task-name>
```

## Deployment

```bash
fly launch
fly secrets set DISCORD_TOKEN=xxx CRAFT_API_URL=xxx CRAFT_API_KEY=xxx DISCORD_CHANNEL_ID=xxx
fly deploy
```

## Verbundene Hubs

- HUB-02 SiCKaRiM Music
- HUB-03 Thriven NFC
- HUB-05 LoopMeLiveUp
- HUB-06 Freigeist System
- HUB-07 GitHub Repository Hub

## Docs

- [Craft API Docs](https://connect.craft.do/api-docs/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Discord.js Guide](https://discord.js.org/)
- [Fly.io Docs](https://fly.io/docs/)
- [Probot Docs](https://probot.github.io/)
