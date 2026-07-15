CREATE OR REPLACE FUNCTION auth.get_operations_roles(
    p_id_user INTEGER,
    p_id_store INTEGER
)
RETURNS TABLE(
    id_operation INTEGER,
    name_operation VARCHAR(1000),
    id_role INTEGER,
    name_role VARCHAR(1000),
    id_option_menu INTEGER,
    name_option_menu VARCHAR(1000),
    route_option_menu VARCHAR(1000)
)
LANGUAGE sql  -- Nota: LANGUAGE SQL, no plpgsql (más rápido para queries simples)
STABLE
AS $$
    select act.id as id_operation,
       act.name_action as name_operation,
       r.id as id_role,
       r.name_role as name_role,
       om.id as id_option_menu,
       om.name_option as name_option_menu,
       om.route_option as route_option_menu
  from auth.operation_roles t 
  inner join auth.option_menu om on (om.id = t.id_option)
  inner join auth.roles r on (r.id = t.id_role)
  inner join auth.actions act on (act.id = t.id_action)
  inner join auth.option_menu_roles omr on (omr.id_option_menu  = om.id and omr.id_roles = r.id)
  inner join auth.user_roles ur on (ur.id_role = r.id)
  where ur.id_user = p_id_user
    and ur.id_store = p_id_store;
$$;