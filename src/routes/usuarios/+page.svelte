<script>
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { ROLES } from '$lib/permisos.js';
	import { esCorreo, esCelular, nombreCompleto, passwordValida } from '$lib/validar.js';
	import InputPassword from '$lib/components/InputPassword.svelte';

	let f = $state({ nombre: '', correo: '', celular: '', rol: 'egresado', password: '' });
	let errores = $state({});
	let ok = $state('');
	let busqueda = $state('');
	let filtroRol = $state('todos');

	let lista = $derived(
		datos.usuarios
			.filter((u) => filtroRol === 'todos' || u.rol === filtroRol)
			.filter((u) => (u.nombre + ' ' + u.correo).toLowerCase().includes(busqueda.toLowerCase()))
	);
	const colorRol = { admin: 'bg-primary', coordinador: 'bg-warning text-dark', egresado: 'bg-success' };

	function crear(e) {
		e.preventDefault();
		errores = {}; ok = '';
		if (f.rol === 'egresado' ? !nombreCompleto(f.nombre) : f.nombre.trim().length < 3) errores.nombre = f.rol === 'egresado' ? 'Ingresa nombre y apellido.' : 'Ingresa el nombre.';
		if (!esCorreo(f.correo)) errores.correo = 'Correo inválido.';
		if (!esCelular(f.celular)) errores.celular = 'Celular de 10 dígitos que empiece por 3.';
		if (!passwordValida(f.password)) errores.password = 'Mínimo 8 caracteres, con letras y números.';
		if (Object.keys(errores).length) return;
		const r = datos.registrar({ ...f });
		if (!r.ok) { errores = { [r.campo]: r.error }; return; }
		ok = `Usuario "${f.nombre.trim()}" creado correctamente.`;
		f = { nombre: '', correo: '', celular: '', rol: 'egresado', password: '' };
	}

	function cambiarRol(u, nuevoRol) {
		if (u.id === auth.usuario?.id) return;
		datos.cambiarRol(u.id, nuevoRol);
	}
</script>

<h4 class="fw-bold mb-3"><i class="bi bi-person-badge-fill me-2"></i>Gestión de usuarios</h4>

<form class="card p-4 shadow-sm mb-4" onsubmit={crear} novalidate>
	<h6 class="fw-bold mb-3">Crear usuario</h6>
	{#if ok}<div class="alert alert-success py-2"><i class="bi bi-check-circle-fill"></i> {ok}</div>{/if}
	<div class="row g-3">
		<div class="col-md-4"><input class="form-control" class:is-invalid={errores.nombre} placeholder="Nombre" bind:value={f.nombre} /><div class="invalid-feedback">{errores.nombre}</div></div>
		<div class="col-md-4"><input class="form-control" class:is-invalid={errores.correo} placeholder="Correo" bind:value={f.correo} /><div class="invalid-feedback">{errores.correo}</div></div>
		<div class="col-md-4"><input class="form-control" class:is-invalid={errores.celular} placeholder="Celular" maxlength="10" value={f.celular} oninput={(e) => (f.celular = e.target.value.replace(/\D/g, ''))} /><div class="invalid-feedback">{errores.celular}</div></div>
		<div class="col-md-4"><select class="form-select" bind:value={f.rol}><option value="egresado">Egresado</option><option value="coordinador">Coordinador de Egresados</option><option value="admin">Administrador</option></select></div>
		<div class="col-md-5"><InputPassword id="u-pass" label="" bind:value={f.password} error={errores.password} placeholder="Contraseña temporal" autocomplete="new-password" /></div>
		<div class="col-md-3"><button class="btn btn-primary w-100" type="submit"><i class="bi bi-person-plus-fill"></i> Crear usuario</button></div>
	</div>
</form>

<div class="row g-2 mb-3">
	<div class="col-md-6"><div class="input-group"><span class="input-group-text"><i class="bi bi-search"></i></span><input class="form-control" placeholder="Buscar por nombre o correo..." bind:value={busqueda} /></div></div>
	<div class="col-md-3"><select class="form-select" bind:value={filtroRol}><option value="todos">Todos los roles</option><option value="admin">Administradores</option><option value="coordinador">Coordinadores</option><option value="egresado">Egresados</option></select></div>
</div>

<div class="card shadow-sm">
	<div class="table-responsive">
		<table class="table align-middle mb-0">
			<thead class="table-light"><tr><th>Nombre</th><th>Correo</th><th>Celular</th><th>Rol</th><th>Estado</th><th class="text-end">Acciones</th></tr></thead>
			<tbody>
				{#each lista as u (u.id)}
					<tr>
						<td class="fw-semibold">{u.nombre}{#if u.id === auth.usuario?.id} <span class="badge bg-light text-dark border">tú</span>{/if}</td>
						<td>{u.correo}</td><td>{u.celular}</td>
						<td>
							<select class="form-select form-select-sm {colorRol[u.rol]}" style="width:auto; min-width:190px;" disabled={u.id === auth.usuario?.id} value={u.rol} onchange={(e) => cambiarRol(u, e.target.value)}>
								<option value="admin">Administrador</option>
								<option value="coordinador">Coordinador de Egresados</option>
								<option value="egresado">Egresado</option>
							</select>
						</td>
						<td><button class="btn btn-sm {u.estado === 'Activo' ? 'btn-outline-success' : 'btn-outline-secondary'}" disabled={u.id === auth.usuario?.id} onclick={() => datos.cambiarEstadoUsuario(u.id)}>{u.estado}</button></td>
						<td class="text-end"><button class="btn btn-sm btn-outline-danger" disabled={u.id === auth.usuario?.id} onclick={() => datos.eliminarUsuario(u.id)}><i class="bi bi-trash"></i></button></td>
					</tr>
				{:else}
					<tr><td colspan="6" class="text-center text-muted py-4">Sin resultados.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
