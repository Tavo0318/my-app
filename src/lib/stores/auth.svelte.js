// Sesión del usuario. Cuando conecten la API, login() llamará al endpoint y guardará el JWT;
// el resto de la app (menú, guards, páginas) no cambia.
import { datos } from '$lib/stores/datos.svelte.js';

function cargarSesion() {
	if (typeof localStorage === 'undefined') return null;
	const raw = localStorage.getItem('sesion');
	return raw ? JSON.parse(raw) : null;
}

class AuthStore {
	usuario = $state(cargarSesion());

	get autenticado() { return this.usuario !== null; }
	get rol() { return this.usuario?.rol ?? null; }

	// Devuelve { ok: true } o { ok: false, error }
	login(correo, password) {
		const u = datos.usuarios.find((x) => x.correo.toLowerCase() === correo.trim().toLowerCase());
		// Mensaje genérico a propósito: no revela si el correo existe o no.
		if (!u || u.password !== password) return { ok: false, error: 'Correo o contraseña incorrectos.' };
		if (u.estado !== 'Activo') return { ok: false, error: 'Tu cuenta está bloqueada. Comunícate con la Oficina de Egresados.' };
		this.abrirSesion(u);
		datos.log('Inicio de sesión');
		datos.guardarTodo();
		return { ok: true };
	}
	abrirSesion(u) {
		this.usuario = { id: u.id, nombre: u.nombre, rol: u.rol, correo: u.correo };
		datos.actor = this.usuario;
		localStorage.setItem('sesion', JSON.stringify(this.usuario));
	}
	logout() {
		datos.log('Cierre de sesión');
		datos.guardarTodo();
		this.usuario = null;
		datos.actor = null;
		localStorage.removeItem('sesion');
	}
}

export const auth = new AuthStore();
datos.actor = auth.usuario;
