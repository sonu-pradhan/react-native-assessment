create or replace function public.restrict_domain_hook(event jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  user_email text;
begin
  user_email := lower(event->'user'->>'email');

  if user_email is null or user_email not like '%@hbplus.fit' then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 403,
        'message', 'Access restricted. Please login using your official domain email.'
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

grant execute on function public.restrict_domain_hook to supabase_auth_admin;
revoke execute on function public.restrict_domain_hook from authenticated, anon, public;