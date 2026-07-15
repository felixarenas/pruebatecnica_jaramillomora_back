CREATE OR REPLACE FUNCTION auth.get_menu(
    p_id_user INTEGER,
    p_id_store INTEGER
)
RETURNS TABLE(
    id_option INTEGER,
    id_role INTEGER,
    name_role VARCHAR(1000),
    id_menu INTEGER,
    id_pather_menu INTEGER,
    name_menu VARCHAR(1000),
    name_option VARCHAR(1000),
    route_option VARCHAR(1000),
    option_menu INTEGER
)
LANGUAGE sql  -- Nota: LANGUAGE SQL, no plpgsql (más rápido para queries simples)
STABLE
AS $$
    select tabla.* from (
		  select om.id as id_option,
		       r.id as id_role,
		       r.name_role,
		       m.id as id_menu,
		       m.id_pather_menu,
		       m.name_menu,
		       om.name_option,
		       om.route_option,
		       1 as option_menu
		  from auth.user_roles ur
		  inner join auth.option_menu_roles omr on (ur.id_role = omr.id_roles)
		  inner join auth.option_menu om on (om.id = omr.id_option_menu)
		  inner join auth.menu m on (om.id_menu = m.id)
		  inner join auth.roles r on (r.id = omr.id_roles)
		 where ur.id_user = p_id_user
		   and ur.id_store = p_id_store
		union all
		select om.id as id_option,
		       r.id as id_role,
		       r.name_role,
		       mp.id as id_menu,
		       mp.id_pather_menu,
		       mp.name_menu,
		       om.name_option,
		       om.route_option,
		       0 as option_menu
		  from auth.user_roles ur
		  inner join auth.option_menu_roles omr on (ur.id_role = omr.id_roles)
		  inner join auth.option_menu om on (om.id = omr.id_option_menu)
		  inner join auth.menu m on (om.id_menu = m.id)
		  inner join auth.menu mp on (mp.id = m.id_pather_menu)
		  inner join auth.roles r on (r.id = omr.id_roles)
		 where ur.id_user = p_id_user
		   and ur.id_store = p_id_store
		) tabla order by tabla.name_menu asc;
$$;