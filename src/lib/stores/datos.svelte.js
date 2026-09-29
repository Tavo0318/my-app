// "Base de datos" simulada mientras no está la API conectada (se guarda en localStorage).
// Las contraseñas están en texto plano solo por ser front; en el backend real van cifradas.
import { permisosIniciales } from '$lib/roles.js';

function cargar(clave, porDefecto) {
	if (typeof localStorage === 'undefined') return porDefecto;
	const raw = localStorage.getItem(clave);
	return raw ? JSON.parse(raw) : porDefecto;
}
function guardarEn(clave, valor) {
	if (typeof localStorage !== 'undefined') localStorage.setItem(clave, JSON.stringify(valor));
}
const norm = (s) => (s ?? '').trim().toLowerCase();
const normNit = (s) => (s ?? '').replace(/[.\s-]/g, '');
const hoy = () => new Date().toISOString().slice(0, 10);

// ---------------- Datos iniciales ----------------
const Em = (id, nombre, nit, sector, ciudad, web, contacto, correo, celular, estado = 'activa') => ({ id, nombre, nit, sector, ciudad, web, contacto, correo, celular, estado });
const EMPRESAS_INICIALES = [
	Em(1, 'TechSoft Colombia', '900.221.331-4', 'Tecnología', 'Barranquilla', 'www.techsoft.co', 'Paola Herrera', 'rrhh@techsoft.co', '3001112233'),
	Em(2, 'CaribeDev', '901.004.221-8', 'Tecnología', 'Barranquilla', 'www.caribedev.co', 'Luis Barrios', 'talento@caribedev.co', '3002223344'),
	Em(3, 'Grupo Andina', '860.112.908-3', 'Comercio', 'Bogotá', 'www.grupoandina.co', 'Sandra Rojas', 'seleccion@grupoandina.co', '3003334455'),
	Em(4, 'NexaSoft', '901.556.019-2', 'Tecnología', 'Barranquilla', 'www.nexasoft.co', 'Mario Peña', 'hola@nexasoft.co', '3004445566'),
	Em(5, 'Soluciones Globales', '900.870.114-6', 'Servicios', 'Barranquilla', 'www.solglobales.co', 'Andrea Cano', 'rrhh@solglobales.co', '3005556677'),
	Em(6, 'Constructora del Norte', '800.315.772-0', 'Construcción', 'Soledad', 'www.cnorte.co', 'Jorge Mejía', 'personal@cnorte.co', '3006667788'),
	Em(7, 'Clínica del Caribe', '890.102.334-9', 'Salud', 'Barranquilla', 'www.clinicacaribe.co', 'Rosa Vidal', 'talento@clinicacaribe.co', '3007778899'),
	Em(8, 'PortCol', '830.221.456-7', 'Logística', 'Cartagena', 'www.portcol.co', 'Iván Correa', 'gestion@portcol.co', '3008889900'),
	Em(9, 'Coldistribuciones', '830.556.212-1', 'Comercio', 'Barranquilla', 'www.coldistribuciones.co', 'Elena Ruiz', 'rrhh@coldistribuciones.co', '3009990011', 'inactiva')
];
const empId = (n) => EMPRESAS_INICIALES.find((e) => e.nombre === n).id;
const V = (id, cargo, empresa, area, modalidad, tipo, ciudad, salario, fecha, estado, descripcion) => ({ id, cargo, empresaId: empId(empresa), empresa, area, modalidad, tipo, ciudad, salario, fecha, estado, descripcion });
const VACANTES_INICIALES = [
	V(1, 'Desarrollador Frontend SvelteKit', 'TechSoft Colombia', 'Tecnología', 'Híbrido', 'Tiempo completo', 'Barranquilla', '$ 3.500.000', '2026-09-25', 'abierta', 'Construcción de interfaces con SvelteKit y Bootstrap. Trabajo en equipo con diseño y backend.'),
	V(2, 'Analista de Sistemas', 'CaribeDev', 'Tecnología', 'Remoto', 'Tiempo completo', 'Barranquilla', '$ 3.000.000', '2026-09-24', 'abierta', 'Levantamiento de requerimientos, documentación y soporte a los sistemas internos.'),
	V(3, 'Analista de Datos Jr.', 'Grupo Andina', 'Tecnología', 'Remoto', 'Tiempo completo', 'Bogotá', '$ 3.200.000', '2026-09-22', 'abierta', 'Construcción de tableros en Power BI y limpieza de datos con SQL y Python.'),
	V(4, 'Coordinador de Logística', 'PortCol', 'Logística', 'Presencial', 'Tiempo completo', 'Cartagena', '$ 4.200.000', '2026-09-26', 'abierta', 'Coordinación de operaciones portuarias, control de inventarios y proveedores.'),
	V(5, 'Auxiliar Contable', 'Soluciones Globales', 'Finanzas', 'Presencial', 'Medio tiempo', 'Barranquilla', '$ 1.800.000', '2026-09-20', 'abierta', 'Registro de comprobantes, conciliaciones bancarias y apoyo en cierres mensuales.'),
	V(6, 'Practicante de Marketing Digital', 'NexaSoft', 'Marketing', 'Híbrido', 'Prácticas', 'Barranquilla', '$ 1.423.500', '2026-09-23', 'abierta', 'Gestión de redes sociales, campañas de pauta y reportes de resultados.'),
	V(7, 'Ingeniero Residente de Obra', 'Constructora del Norte', 'Ingeniería', 'Presencial', 'Tiempo completo', 'Soledad', '$ 4.800.000', '2026-09-18', 'abierta', 'Supervisión de obra civil, control de presupuesto y cumplimiento de cronograma.'),
	V(8, 'Enfermero(a) Profesional', 'Clínica del Caribe', 'Salud', 'Presencial', 'Tiempo completo', 'Barranquilla', '$ 3.100.000', '2026-09-21', 'abierta', 'Atención de pacientes, administración de medicamentos y registro clínico.'),
	V(9, 'Asistente de Talento Humano', 'Grupo Andina', 'Administración', 'Híbrido', 'Tiempo completo', 'Bogotá', '$ 2.600.000', '2026-09-19', 'abierta', 'Apoyo en selección, contratación y nómina. Manejo de Excel intermedio.'),
	V(10, 'Docente de Programación', 'CaribeDev', 'Educación', 'Remoto', 'Medio tiempo', 'Barranquilla', '$ 2.200.000', '2026-09-10', 'cerrada', 'Dictado de talleres de programación web para jóvenes y adultos.')
];

const Eg = (id, nombre, programa, cargoDeseado, ciudad, anio, estadoLaboral, correo, celular) => ({ id, nombre, programa, cargoDeseado, ciudad, anio, estadoLaboral, correo, celular, resumen: '', cv: '', empresaActual: '' });
const EGRESADOS_INICIALES = [
	Eg(201, 'Jaime Valencia', 'Ingeniería de Sistemas', 'Desarrollador Frontend', 'Soledad', 2025, 'Buscando', 'jaime.valencia@redegresados.edu.co', '3101110001'),
	Eg(202, 'Gustavo Piña', 'Administración de Empresas', 'Analista Comercial', 'Barranquilla', 2024, 'Empleado', 'gustavo.pina@redegresados.edu.co', '3101110002'),
	Eg(203, 'Jhoicer Ospino', 'Ingeniería Industrial', 'Coordinador de Logística', 'Barranquilla', 2025, 'Buscando', 'jhoicer.ospino@redegresados.edu.co', '3101110003'),
	Eg(204, 'Laura Restrepo', 'Contaduría Pública', 'Auxiliar Contable', 'Malambo', 2023, 'Empleado', 'laura.restrepo@redegresados.edu.co', '3101110004'),
	Eg(205, 'Kevin Mora', 'Mercadeo y Publicidad', 'Marketing Digital', 'Barranquilla', 2025, 'Buscando', 'kevin.mora@redegresados.edu.co', '3101110005'),
	Eg(206, 'Diana Pardo', 'Ingeniería Industrial', 'Coordinadora de Operaciones', 'Cartagena', 2022, 'Empleado', 'diana.pardo@redegresados.edu.co', '3101110006'),
	Eg(207, 'Camila Torres', 'Enfermería', 'Enfermera Profesional', 'Barranquilla', 2025, 'Buscando', 'camila.torres@redegresados.edu.co', '3101110007'),
	Eg(208, 'Andrés Salcedo', 'Ingeniería de Sistemas', 'Analista de Datos', 'Bogotá', 2024, 'Empleado', 'andres.salcedo@redegresados.edu.co', '3101110008')
];
EGRESADOS_INICIALES[1].empresaActual = 'Soluciones Globales';
EGRESADOS_INICIALES[7].empresaActual = 'Grupo Andina';

const USUARIOS_INICIALES = [
	{ id: 1, nombre: 'Carlos Mendoza', correo: 'admin@redegresados.edu.co', celular: '3200000001', password: 'Admin123', rol: 'admin', estado: 'Activo' },
	{ id: 2, nombre: 'Marcela Ríos', correo: 'coordinador@redegresados.edu.co', celular: '3200000002', password: 'Coordinador123', rol: 'coordinador', estado: 'Activo' },
	...EGRESADOS_INICIALES.map((e) => ({ id: e.id, nombre: e.nombre, correo: e.correo, celular: e.celular, password: 'Egresado123', rol: 'egresado', estado: 'Activo' }))
];

const Po = (id, vacanteId, egresadoId, fecha, estado) => ({ id, vacanteId, egresadoId, fecha, estado });
const POSTULACIONES_INICIALES = [
	Po(1, 1, 201, '2026-09-26', 'En revisión'),
	Po(2, 5, 202, '2026-09-12', 'Contratado'),
	Po(3, 5, 204, '2026-09-21', 'En revisión'),
	Po(4, 6, 205, '2026-09-24', 'Preseleccionado'),
	Po(5, 8, 207, '2026-09-22', 'En revisión'),
	Po(6, 4, 203, '2026-09-26', 'Rechazado'),
	Po(7, 3, 208, '2026-09-05', 'Contratado'),
	Po(8, 2, 201, '2026-09-25', 'Preseleccionado')
];

const ENCUESTAS_INICIALES = [
	{
		id: 1, titulo: 'Seguimiento laboral 2026-2', activa: true, fecha: '2026-09-15',
		descripcion: 'Cuéntanos tu situación laboral actual. Con tus respuestas la universidad mide la empleabilidad de sus egresados.',
		respuestas: [{ egresadoId: 202, laborando: 'Sí', empresa: 'Soluciones Globales', cargo: 'Analista Comercial', relacion: 'Total', fecha: '2026-09-16' }]
	}
];

function perfilNuevo(id, nombre, d = {}) {
	return { id, nombre, programa: d.programa ?? '', cargoDeseado: '', ciudad: d.ciudad ?? '', anio: Number(d.anio) || new Date().getFullYear(), estadoLaboral: 'Buscando', correo: d.correo?.trim() ?? '', celular: d.celular?.trim() ?? '', resumen: '', cv: '', empresaActual: '' };
}

class DatosStore {
	actor = null; // quién está usando el sistema (lo asigna auth); sirve para el registro de actividad
	usuarios = $state(cargar('v4_usuarios', USUARIOS_INICIALES));
	empresas = $state(cargar('v4_empresas', EMPRESAS_INICIALES));
	vacantes = $state(cargar('v4_vacantes', VACANTES_INICIALES));
	postulaciones = $state(cargar('v4_postulaciones', POSTULACIONES_INICIALES));
	egresados = $state(cargar('v4_egresados', EGRESADOS_INICIALES));
	encuestas = $state(cargar('v4_encuestas', ENCUESTAS_INICIALES));
	permisos = $state(cargar('v4_permisos', permisosIniciales()));
	actividad = $state(cargar('v4_actividad', []));

	guardarTodo() {
		guardarEn('v4_usuarios', this.usuarios); guardarEn('v4_empresas', this.empresas);
		guardarEn('v4_vacantes', this.vacantes); guardarEn('v4_postulaciones', this.postulaciones);
		guardarEn('v4_egresados', this.egresados); guardarEn('v4_encuestas', this.encuestas);
		guardarEn('v4_permisos', this.permisos); guardarEn('v4_actividad', this.actividad);
	}
	log(accion, detalle = '') {
		this.actividad.unshift({ id: Date.now() + Math.random(), fecha: new Date().toISOString(), usuario: this.actor?.nombre ?? 'Sistema', rol: this.actor?.rol ?? '', accion, detalle });
		if (this.actividad.length > 200) this.actividad.length = 200;
	}

	// ---------- Usuarios ----------
	registrar(d) {
		const nombre = d.nombre.trim();
		if (this.usuarios.some((u) => norm(u.correo) === norm(d.correo)))
			return { ok: false, campo: 'correo', error: 'Este correo ya está registrado. Inicia sesión o usa otro correo.' };
		if (this.usuarios.some((u) => u.celular === d.celular.trim()))
			return { ok: false, campo: 'celular', error: 'Este número de celular ya pertenece a otra cuenta.' };
		if (d.rol === 'egresado' && this.egresados.some((e) => norm(e.nombre) === norm(nombre)))
			return { ok: false, campo: 'nombre', error: 'Ya existe un egresado con ese nombre completo. Agrega tu segundo apellido.' };
		const id = Date.now();
		this.usuarios.push({ id, nombre, correo: d.correo.trim(), celular: d.celular.trim(), password: d.password, rol: d.rol, estado: 'Activo' });
		if (d.rol === 'egresado') this.egresados.push(perfilNuevo(id, nombre, d));
		this.log('Nuevo usuario', `${nombre} (${d.rol})`);
		this.guardarTodo();
		return { ok: true, id };
	}
	cambiarRol(id, rol) {
		const u = this.usuarios.find((x) => x.id === id);
		u.rol = rol;
		if (rol === 'egresado' && !this.egresados.some((e) => e.id === id)) this.egresados.push(perfilNuevo(id, u.nombre, u));
		this.log('Cambio de rol', `${u.nombre} → ${rol}`);
		this.guardarTodo();
	}
	cambiarEstadoUsuario(id) {
		const u = this.usuarios.find((x) => x.id === id);
		u.estado = u.estado === 'Activo' ? 'Inactivo' : 'Activo';
		this.log(u.estado === 'Activo' ? 'Cuenta activada' : 'Cuenta bloqueada', u.nombre);
		this.guardarTodo();
	}
	eliminarUsuario(id) {
		const u = this.usuarios.find((x) => x.id === id);
		this.usuarios = this.usuarios.filter((x) => x.id !== id);
		this.egresados = this.egresados.filter((e) => e.id !== id);
		this.postulaciones = this.postulaciones.filter((p) => p.egresadoId !== id);
		this.log('Usuario eliminado', u.nombre);
		this.guardarTodo();
	}
	cambiarPassword(id, actual, nueva) {
		const u = this.usuarios.find((x) => x.id === id);
		if (!u) return { ok: false, error: 'Cuenta no encontrada.' };
		if (u.password !== actual) return { ok: false, error: 'La contraseña actual es incorrecta.' };
		if (actual === nueva) return { ok: false, error: 'La nueva contraseña debe ser distinta a la actual.' };
		u.password = nueva;
		this.log('Cambio de contraseña', u.nombre);
		this.guardarTodo();
		return { ok: true };
	}
	actualizarCuenta(id, { celular }) {
		if (this.usuarios.some((u) => u.id !== id && u.celular === celular)) return { ok: false, campo: 'celular', error: 'Ese celular ya pertenece a otra cuenta.' };
		this.usuarios.find((u) => u.id === id).celular = celular;
		const e = this.egresados.find((x) => x.id === id);
		if (e) e.celular = celular;
		this.guardarTodo();
		return { ok: true };
	}

	// ---------- Egresados ----------
	actualizarEgresado(id, campos) {
		const e = this.egresados.find((x) => x.id === id);
		if (!e) return { ok: false, error: 'Perfil no encontrado.' };
		if (campos.celular && this.usuarios.some((u) => u.id !== id && u.celular === campos.celular))
			return { ok: false, campo: 'celular', error: 'Ese celular ya pertenece a otra cuenta.' };
		Object.assign(e, campos);
		const u = this.usuarios.find((x) => x.id === id);
		if (u && campos.celular) u.celular = campos.celular;
		this.log('Perfil actualizado', e.nombre);
		this.guardarTodo();
		return { ok: true };
	}

	// ---------- Empresas ----------
	crearEmpresa(d) {
		if (this.empresas.some((e) => norm(e.nombre) === norm(d.nombre))) return { ok: false, campo: 'nombre', error: 'Ya existe una empresa con esa razón social.' };
		if (this.empresas.some((e) => normNit(e.nit) === normNit(d.nit))) return { ok: false, campo: 'nit', error: 'Ya existe una empresa registrada con ese NIT.' };
		this.empresas.push({ ...d, nombre: d.nombre.trim(), id: Date.now(), estado: 'activa' });
		this.log('Empresa registrada', d.nombre);
		this.guardarTodo();
		return { ok: true };
	}
	actualizarEmpresa(id, d) {
		if (this.empresas.some((e) => e.id !== id && norm(e.nombre) === norm(d.nombre))) return { ok: false, campo: 'nombre', error: 'Ya existe otra empresa con esa razón social.' };
		if (this.empresas.some((e) => e.id !== id && normNit(e.nit) === normNit(d.nit))) return { ok: false, campo: 'nit', error: 'Ya existe otra empresa con ese NIT.' };
		Object.assign(this.empresas.find((e) => e.id === id), d);
		this.vacantes.filter((v) => v.empresaId === id).forEach((v) => (v.empresa = d.nombre));
		this.log('Empresa actualizada', d.nombre);
		this.guardarTodo();
		return { ok: true };
	}
	alternarEmpresa(id) {
		const e = this.empresas.find((x) => x.id === id);
		e.estado = e.estado === 'activa' ? 'inactiva' : 'activa';
		if (e.estado === 'inactiva') this.vacantes.filter((v) => v.empresaId === id).forEach((v) => (v.estado = 'cerrada'));
		this.log(e.estado === 'activa' ? 'Empresa activada' : 'Empresa desactivada', e.nombre);
		this.guardarTodo();
	}
	eliminarEmpresa(id) {
		const e = this.empresas.find((x) => x.id === id);
		if (this.vacantes.some((v) => v.empresaId === id)) return { ok: false, error: 'Esta empresa tiene vacantes asociadas. Elimínalas primero o desactiva la empresa.' };
		this.empresas = this.empresas.filter((x) => x.id !== id);
		this.log('Empresa eliminada', e.nombre);
		this.guardarTodo();
		return { ok: true };
	}

	// ---------- Vacantes ----------
	crearVacante(d) {
		const emp = this.empresas.find((e) => e.id === d.empresaId);
		this.vacantes.push({ ...d, id: Date.now(), empresa: emp.nombre, fecha: hoy(), estado: 'abierta' });
		this.log('Vacante publicada', `${d.cargo} · ${emp.nombre}`);
		this.guardarTodo();
	}
	actualizarVacante(id, d) {
		const v = this.vacantes.find((x) => x.id === id);
		Object.assign(v, d, { empresa: this.empresas.find((e) => e.id === d.empresaId).nombre });
		this.log('Vacante actualizada', v.cargo);
		this.guardarTodo();
	}
	alternarVacante(id) {
		const v = this.vacantes.find((x) => x.id === id);
		if (v.estado === 'cerrada' && this.empresas.find((e) => e.id === v.empresaId)?.estado !== 'activa')
			return { ok: false, error: 'La empresa está inactiva. Actívala para reabrir la vacante.' };
		v.estado = v.estado === 'abierta' ? 'cerrada' : 'abierta';
		this.log(v.estado === 'abierta' ? 'Vacante reabierta' : 'Vacante cerrada', v.cargo);
		this.guardarTodo();
		return { ok: true };
	}
	eliminarVacante(id) {
		const v = this.vacantes.find((x) => x.id === id);
		this.vacantes = this.vacantes.filter((x) => x.id !== id);
		this.postulaciones = this.postulaciones.filter((p) => p.vacanteId !== id);
		this.log('Vacante eliminada', v.cargo);
		this.guardarTodo();
	}

	// ---------- Postulaciones ----------
	postularse(vacanteId, egresadoId) {
		const v = this.vacantes.find((x) => x.id === vacanteId);
		if (!v || v.estado !== 'abierta') return { ok: false, error: 'Esta vacante ya no está disponible.' };
		if (this.postulaciones.some((p) => p.vacanteId === vacanteId && p.egresadoId === egresadoId)) return { ok: false, error: 'Ya te postulaste a esta vacante.' };
		this.postulaciones.push({ id: Date.now(), vacanteId, egresadoId, fecha: hoy(), estado: 'En revisión' });
		this.log('Postulación enviada', v.cargo);
		this.guardarTodo();
		return { ok: true };
	}
	retirarPostulacion(id) {
		this.postulaciones = this.postulaciones.filter((p) => p.id !== id);
		this.log('Postulación retirada');
		this.guardarTodo();
	}
	cambiarEstadoPostulacion(id, estado) {
		const p = this.postulaciones.find((x) => x.id === id);
		p.estado = estado;
		const e = this.egresados.find((x) => x.id === p.egresadoId);
		const v = this.vacantes.find((x) => x.id === p.vacanteId);
		if (estado === 'Contratado' && e) { e.estadoLaboral = 'Empleado'; e.empresaActual = v?.empresa ?? ''; }
		this.log('Postulación: ' + estado, `${e?.nombre} → ${v?.cargo}`);
		this.guardarTodo();
	}

	// ---------- Encuestas ----------
	crearEncuesta(titulo, descripcion) {
		this.encuestas.push({ id: Date.now(), titulo, descripcion, activa: true, fecha: hoy(), respuestas: [] });
		this.log('Encuesta creada', titulo);
		this.guardarTodo();
	}
	alternarEncuesta(id) {
		const e = this.encuestas.find((x) => x.id === id);
		e.activa = !e.activa;
		this.log(e.activa ? 'Encuesta reabierta' : 'Encuesta cerrada', e.titulo);
		this.guardarTodo();
	}
	eliminarEncuesta(id) {
		const e = this.encuestas.find((x) => x.id === id);
		this.encuestas = this.encuestas.filter((x) => x.id !== id);
		this.log('Encuesta eliminada', e.titulo);
		this.guardarTodo();
	}
	responderEncuesta(id, egresadoId, r) {
		const enc = this.encuestas.find((e) => e.id === id);
		if (enc.respuestas.some((x) => x.egresadoId === egresadoId)) return;
		enc.respuestas.push({ egresadoId, ...r, fecha: hoy() });
		const eg = this.egresados.find((x) => x.id === egresadoId);
		if (eg) { eg.estadoLaboral = r.laborando === 'Sí' ? 'Empleado' : 'Buscando'; if (r.empresa) eg.empresaActual = r.empresa; }
		this.log('Encuesta respondida', enc.titulo);
		this.guardarTodo();
	}

	// ---------- Permisos (tabla modulos_x_roles) ----------
	setPermiso(rol, modulo, accion, valor) {
		// El administrador no puede quitarse el acceso a la gestión de roles (se bloquearía el sistema)
		if (rol === 'admin' && modulo === 'roles' && (accion === 'ver' || accion === 'actualizar')) return;
		const p = this.permisos.find((x) => x.rol === rol && x.modulo === modulo);
		p[accion] = valor;
		if (!valor && accion === 'ver') { p.crear = false; p.actualizar = false; p.eliminar = false; }
		if (valor && accion !== 'ver') p.ver = true;
		this.log('Permiso modificado', `${rol} · ${modulo} · ${accion} = ${valor ? 'sí' : 'no'}`);
		this.guardarTodo();
	}
	restablecerPermisos() {
		this.permisos = permisosIniciales();
		this.log('Permisos restablecidos');
		this.guardarTodo();
	}
}

export const datos = new DatosStore();
