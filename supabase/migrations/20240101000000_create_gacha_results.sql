-- テーブルが存在する場合は削除
drop table if exists gacha_results;

-- ガチャ結果テーブルの作成
create table gacha_results (
    id uuid default gen_random_uuid() primary key,
    created_at timestamptz default now() not null,
    player_name text not null,
    amount integer not null check (amount >= 0),
    user_agent text not null
);

-- RLSの設定
alter table gacha_results enable row level security;

-- 匿名ユーザーのアクセスポリシー
create policy "誰でも結果を参照可能"
    on gacha_results
    for select
    to anon
    using (true);

create policy "誰でも結果を作成可能"
    on gacha_results
    for insert
    to anon
    with check (true);

-- インデックスの作成
create index gacha_results_created_at_idx on gacha_results (created_at desc);
create index gacha_results_player_name_idx on gacha_results (player_name); 