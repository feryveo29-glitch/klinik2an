create table if not exists informasi_running_text (
  id uuid default gen_random_uuid() primary key,
  pesan text not null,
  aktif boolean default true,
  tipe text default 'info', -- 'info', 'warning', 'success'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table informasi_running_text enable row level security;

-- Policies
create policy "Public read access"
  on informasi_running_text for select
  using (true);

create policy "Admin full access"
  on informasi_running_text for all
  using (true) -- In a real app, check for admin role here
  with check (true);

-- Seed some initial data
insert into informasi_running_text (pesan, tipe) values
('Selamat Datang di Sistem Informasi Klinik.', 'info'),
('Jangan lupa 3S (Senyum, Sapa, Salam) kepada setiap pasien! 😊', 'success'),
('Rapat evaluasi bulanan akan diadakan hari Jumat pukul 13.00 WIB.', 'warning');
