// Consulta de permisos. Todo sale de la tabla de permisos (datos.permisos),
// así que si el administrador la edita, el menú y los botones cambian solos.

import { datos } from '$lib/stores/datos.svelte.js';

import { MODULOS, HOME, PUBLICAS, ROLES } from '$lib/roles.js';

// Acciones disponibles para gestionar los permisos.
export const ACCIONES = ['ver', 'crear', 'editar', 'borrar'];

export { HOME, PUBLICAS, ROLES, MODULOS };

export function puede(rol, modulo, accion) {
    return datos.permisos.find(
        (p) => p.rol === rol && p.modulo === modulo
    )?.[accion] === true;
}

export function menuDe(rol) {
    const modulos = MODULOS
        .filter((m) => puede(rol, m.id, 'ver'))
        .map((m) => ({
            href: m.ruta,
            label: m.etiquetas?.[rol] ?? m.nombre,
            icon: m.icono,
            desc: m.desc
        }));

    return [
        {
            href: '/panel',
            label: 'Panel principal',
            icon: 'bi-speedometer2',
            desc: ''
        },
        ...modulos,
        {
            href: '/cuenta',
            label: 'Mi cuenta',
            icon: 'bi-person-gear',
            desc: 'Contraseña y datos de contacto'
        }
    ];
}

// ¿Este rol puede entrar a esta ruta?
// /panel y /cuenta son para todos los que iniciaron sesión.
export function accesoRuta(rol, ruta) {
    const seg = '/' + (ruta.split('/')[1] ?? '');

    if (seg === '/panel' || seg === '/cuenta') return true;

    const m = MODULOS.find((x) => x.ruta === seg);

    return m ? puede(rol, m.id, 'ver') : false;
}