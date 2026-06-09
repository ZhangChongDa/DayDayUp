-- 确保 PIN 相关函数存在且 service_role 可调用
create extension if not exists pgcrypto;

create or replace function public.hash_pin(p_pin text)
returns text as $$
begin
  return crypt(p_pin, gen_salt('bf', 10));
end;
$$ language plpgsql security definer;

create or replace function public.verify_student_pin(
  p_profile_id uuid,
  p_pin        text
) returns boolean as $$
declare
  stored_hash text;
begin
  select pin_code into stored_hash
  from public.user_profiles
  where id = p_profile_id and role = 'student' and is_active = true;

  if stored_hash is null then
    return false;
  end if;

  -- 非 bcrypt 格式（历史明文）直接比对
  if stored_hash not like '$2%' then
    return stored_hash = p_pin;
  end if;

  return stored_hash = crypt(p_pin, stored_hash);
end;
$$ language plpgsql security definer;

GRANT EXECUTE ON FUNCTION public.hash_pin(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.verify_student_pin(uuid, text) TO service_role;

NOTIFY pgrst, 'reload schema';
