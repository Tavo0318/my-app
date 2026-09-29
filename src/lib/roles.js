// Definición de roles y módulos del sistema (equivale a las tablas roles, modulos y modulos_x_roles).

export const PUBLICAS = ['/', '/login', '/registro'];
export const HOME = { admin: '/panel', coordinador: '/panel', egresado: '/panel' };

export const ROLES = {
	admin: { nombre: 'Administrador', icono: 'bi-shield-lock-fill', color: '#16255c', descripcion: 'Gestiona usuarios, roles y permisos, la configuración y supervisa la actividad del sistema.' },
	coordinador: { nombre: 'Coordinador de Egresados', icono: 'bi-diagram-3-fill', color: '#e8940c', descripcion: 'Oficina de Egresados: registra empresas aliadas, publica vacantes, gestiona postulaciones y encuestas.' },
	egresado: { nombre: 'Egresado', icono: 'bi-mortarboard-fill', color: '#0e8c7f', descripcion: 'Mantiene su perfil profesional, busca vacantes, se postula y responde las encuestas de seguimiento.' }
};

export const MODULOS = [
	{ id: 'usuarios', nombre: 'Usuarios', ruta: '/usuarios', icono: 'bi-person-badge-fill', desc: 'Cuentas de acceso, rol asignado y bloqueo de cuentas' },
	{ id: 'roles', nombre: 'Roles y permisos', ruta: '/roles', icono: 'bi-shield-check', desc: 'Módulos y acciones autorizadas para cada rol' },
	{ id: 'empresas', nombre: 'Empresas aliadas', ruta: '/empresas', icono: 'bi-building-fill', desc: 'Empresas con convenio y sus datos de contacto' },
	{ id: 'vacantes', nombre: 'Vacantes', ruta: '/vacantes', icono: 'bi-briefcase-fill', desc: 'Ofertas laborales publicadas por empresas aliadas' },
	{ id: 'postulaciones', nombre: 'Postulaciones', ruta: '/postulaciones', icono: 'bi-send-check-fill', desc: 'Seguimiento del proceso de selección', etiquetas: { egresado: 'Mis postulaciones' } },
	{ id: 'egresados', nombre: 'Directorio de egresados', ruta: '/egresados', icono: 'bi-people-fill', desc: 'Consulta de perfiles profesionales' },
	{ id: 'perfil', nombre: 'Mi perfil', ruta: '/perfil', icono: 'bi-person-circle', desc: 'Hoja de vida y datos profesionales' },
	{ id: 'encuestas', nombre: 'Encuestas', ruta: '/encuestas', icono: 'bi-clipboard-data-fill', desc: 'Seguimiento laboral de los egresados', etiquetas: { egresado: 'Mis encuestas' } },
	{ id: 'reportes', nombre: 'Reportes', ruta: '/reportes', icono: 'bi-bar-chart-fill', desc: 'Indicadores de empleabilidad' },
	{ id: 'configuracion', nombre: 'Configuración', ruta: '/configuracion', icono: 'bi-gear-fill', desc: 'Parámetros del sistema y registro de actividad' }
];

export const ACCIONES = [['ver', 'Ver'], ['crear', 'Crear'], ['actualizar', 'Actualizar'], ['eliminar', 'Eliminar']];

// v = ver, c = crear, u = actualizar, d = eliminar
const P = {
	usuarios:      { admin: 'vcud', coordinador: '',    egresado: '' },
	roles:         { admin: 'vu',   coordinador: '',    egresado: '' },
	empresas:      { admin: 'vcud', coordinador: 'vcu', egresado: 'v' },
	vacantes:      { admin: 'vcud', coordinador: 'vcu', egresado: 'v' },
	postulaciones: { admin: 'vud',  coordinador: 'vu',  egresado: 'vcd' },
	egresados:     { admin: 'v',    coordinador: 'v',   egresado: '' },
	perfil:        { admin: '',     coordinador: '',    egresado: 'vu' },
	encuestas:     { admin: 'vcud', coordinador: 'vcu', egresado: 'vc' },
	reportes:      { admin: 'v',    coordinador: 'v',   egresado: '' },
	configuracion: { admin: 'vu',   coordinador: '',    egresado: '' }
};

export const permisosIniciales = () =>
	Object.entries(P).flatMap(([modulo, roles]) =>
		Object.entries(roles).map(([rol, s]) => ({
			modulo, rol,
			ver: s.includes('v'), crear: s.includes('c'), actualizar: s.includes('u'), eliminar: s.includes('d')
		}))
	);
