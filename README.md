# Vacancy follow-up tracker

A local-first tool that turns a weekly ATS export into a clean, deduplicated list of vacancies that have been open too long without approval — and keeps track of where each one stands as I chase the hiring managers.

It runs as a single HTML file. No install, no server, no accounts, no internet. All data stays in the browser on the machine it's opened on.



## The problem

Part of recruitment operations is making sure vacancies actually get approved and don't quietly stall. My weekly routine was:

1. Download an Excel export of vacancy statuses from the ATS.
2. Filter it down to roles open past a threshold (15 days) that still weren't approved.
3. Chase the relevant hiring managers.
4. ...try to remember, the following week, who I'd already contacted, what they said, and which of last week's roles were still outstanding.

Step 4 was the weak point. Each export is a fresh snapshot, so there was no memory between weeks — the same roles reappeared, I re-did the filtering, and my follow-up notes lived in my head or in scattered messages.

## What it does

- **Imports the raw ATS export** (`.xlsx` / `.csv`) and filters to only the roles that need action: open past the threshold _and_ not yet approved.
- **Deduplicates against what I'm already tracking**, keyed on the vacancy/requisition ID, so re-uploading next week's export adds only the genuinely new roles instead of piling up duplicates.
- **Tracks a follow-up status per role** through a small lifecycle — Not contacted → Awaiting reply → In discussion → Escalated → Approved → Closed — plus a free-text note for what the manager actually said.
- **Auto-flags roles that have since been approved.** If a role I'm tracking shows up as approved in a later export, it's marked so I can clear it in one click — the list keeps itself current instead of growing forever.
- **Persists between sessions** on the same machine, with a backup/restore file so the history is portable and safe.

## Product decisions worth calling out

- **Deduplication is the whole point.** The tool's job isn't to display an export — it's to hold state _across_ exports. Choosing a stable key (the requisition ID) and preserving my status/notes on re-import while refreshing the ATS-side fields is what makes weekly use painless.
- **Two separate notions of "status."** The ATS status (from the file) and my follow-up status (my workflow) are deliberately kept apart. Collapsing them would lose the distinction between "the system says X" and "here's where _I_ am with it."
- **Self-closing list.** Detecting when a tracked role becomes approved and prompting to resolve it means the list trends toward empty as work gets done, rather than accumulating stale rows.
- **Local-first by design.** This handles internal recruitment data, so the safest architecture is the one where the data never leaves the machine. That ruled out a hosted database and made a single offline file the right call — a constraint that turned into a feature.
- **Configurable, not hard-coded.** The day threshold, the column mapping, and which ATS statuses count as "approved" are all set in the UI and remembered, so it adapts to a different export format without touching code.

## Run it

Download `vacancy-follow-up-tracker.html` and open it in your browser (double-click, or drag it into a tab). That's it.

- Click **Upload ATS export** and, the first time, match your columns (it auto-guesses from the headers).
- Set the day threshold and tick which ATS statuses mean "approved."
- Work through the flagged roles, tagging each and adding notes.
- Use **Backup** now and then to save a portable copy of your list; **Restore** loads it back (e.g. on a new machine).

Your list is saved automatically in that browser. Clearing the browser's site data will remove the auto-saved copy — the backup file is the safety net.

## Build from source

The HTML file is generated; you don't need to build it to use it. To rebuild after changing the source:

```bash
npm install
npm run build
```

This bundles `src/` with esbuild, generates a minimal Tailwind stylesheet, and inlines both into a single self-contained `vacancy-follow-up-tracker.html`.

## Tech

- **React 18** for the UI, authored in `src/app.jsx`.
- **[SheetJS](https://sheetjs.com/)** to parse the Excel/CSV export in the browser.
- **Tailwind CSS** (only the classes actually used are emitted).
- **esbuild** to bundle everything into one file; there are no runtime dependencies or network calls.

The output is a ~600 KB standalone HTML file that works fully offline.

## Data & privacy

Nothing is uploaded anywhere. The ATS file is read in-browser and never transmitted; your tracked list is stored only in that browser's local storage, on your own device.

## Limitations

- Storage is per-browser, per-machine (this is intentional). Moving to another machine or browser means restoring from a backup file.
- Built for a single user; it isn't a shared, multi-user list.
- Assumes the export has a stable vacancy/requisition ID to deduplicate on.

## License

MIT — see [LICENSE](LICENSE).
