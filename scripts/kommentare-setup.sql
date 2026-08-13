-- Eventlas: Kommentar-Datenbank einrichten
-- Einmal ausführen im Supabase-Dashboard unter "SQL Editor" → "New query" → einfügen → "Run".
-- Danach nur noch URL und anon-Key in die KONFIG der index.html eintragen.
--
-- Sicherheitsgedanke: Der anon-Key steht öffentlich im Quelltext der Seite. Was damit möglich
-- ist, entscheidet allein diese Datei. Erlaubt sind: sichtbare Kommentare lesen, neue schreiben,
-- melden, eigene löschen. Alles andere — auch das Ändern fremder Beiträge — ist ausgeschlossen.

create table if not exists public.kommentare (
  id          uuid primary key default gen_random_uuid(),
  stadt       text        not null default 'aachen',
  pin_id      text        not null,
  name        text,
  text        text        not null,
  erstellt    timestamptz not null default now(),
  meldungen   int         not null default 0,
  versteckt   boolean     not null default false,
  -- Grenzen direkt in der Datenbank: so kann auch ein manipulierter Aufruf nichts Größeres schreiben
  constraint text_laenge  check (char_length(text) between 2 and 600),
  constraint name_laenge  check (name is null or char_length(name) <= 40),
  constraint pin_laenge   check (char_length(pin_id) <= 80)
);

create index if not exists kommentare_pin_idx
  on public.kommentare (stadt, pin_id, erstellt);

alter table public.kommentare enable row level security;

-- Lesen: nur was nicht versteckt ist
drop policy if exists "lesen" on public.kommentare;
create policy "lesen" on public.kommentare
  for select using (versteckt = false);

-- Schreiben: erlaubt, aber ohne Einfluss auf die Moderationsfelder
drop policy if exists "schreiben" on public.kommentare;
create policy "schreiben" on public.kommentare
  for insert with check (
    versteckt = false and meldungen = 0
    and char_length(text) between 2 and 600
  );

-- Ändern und Löschen laufen ausschließlich über die beiden Funktionen unten.
-- (Keine update/delete-Policy = für den anon-Key gesperrt.)

-- Melden: zählt hoch und blendet ab drei Meldungen aus. Läuft mit erhöhten Rechten,
-- kann aber nur genau dieses eine Feld verändern.
create or replace function public.kommentar_melden(kommentar_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.kommentare
     set meldungen = meldungen + 1,
         versteckt = (meldungen + 1) >= 3
   where id = kommentar_id;
$$;

-- Eigenen Beitrag löschen: nur innerhalb von 24 Stunden nach dem Schreiben.
-- Die App merkt sich lokal, welche Beiträge einem gehören; das Zeitfenster verhindert,
-- dass jemand mit erratenen IDs alte Beiträge fremder Leute entfernt.
create or replace function public.kommentar_loeschen(kommentar_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.kommentare
   where id = kommentar_id
     and erstellt > now() - interval '24 hours';
$$;

grant execute on function public.kommentar_melden(uuid)   to anon;
grant execute on function public.kommentar_loeschen(uuid) to anon;

-- Übersicht für die Moderation: zeigt gemeldete und ausgeblendete Beiträge zuerst.
-- Aufrufen im SQL-Editor:  select * from public.moderation;
create or replace view public.moderation as
  select id, stadt, pin_id, name, text, erstellt, meldungen, versteckt
    from public.kommentare
   order by versteckt desc, meldungen desc, erstellt desc;
