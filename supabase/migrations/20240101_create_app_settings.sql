create table if not exists app_settings (
  key text primary key,
  value jsonb not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table app_settings enable row level security;

-- Policies
create policy "Public read access"
  on app_settings for select
  using (true);

create policy "Admin full access"
  on app_settings for all
  using (true) -- In a real app, check for admin role here
  with check (true);

-- Seed initial settings
insert into app_settings (key, value, description) values
('running_text_speed', '"45s"', 'Kecepatan running text footer (duration)');
