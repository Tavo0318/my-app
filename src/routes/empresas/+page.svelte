<script>
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { puede } from '$lib/permisos.js';
	import { esCelular, esNit } from '$lib/validar.js';

	const SECTORES = ['Tecnología', 'Comercio', 'Servicios', 'Construcción', 'Salud', 'Logística', 'Educación', 'Finanzas'];
	const puedeCrear = $derived(puede(auth.rol, 'empresas', 'crear'));
	const puedeEditar = $derived(puede(auth.rol, 'empresas', 'actualizar'));
	const puedeBorrar = $derived(puede(auth.rol, 'empresas', 'eliminar'));

	let q = $state('');
	let filtradas = $derived(datos.empresas.filter((e) => (e.nombre + ' ' + e.sector + ' ' + e.ciudad).toLowerCase().includes(q.toLowerCase())));

	const vacia = () => ({ id: null, nombre: '', nit: '', sector: 'Tecnología', ciudad: 'Barranquilla', web: '', contacto: '', correo: '', celular: '' });
	let form = $state(vacia());
	let mostrarForm = $state(false);
	let errores = $state({});
	let errorGeneral = $state('');

	function nueva() { form = vacia(); errores = {}; errorGeneral = ''; mostrarForm = true; }
	function editar(e) { form = { ...e }; errores = {}; errorGeneral = ''; mostrarForm = true; }

	function guardar(e) {
		e.preventDefault();
		errores = {};
		if (form.nombre.trim().length < 3) errores.nombre = 'Ingresa la razón social.';
		if (!esNit(form.nit)) errores.nit = 'NIT inválido. Ejemplo: 900.123.456-7';
		if (!esCelular(form.celular)) errores.celular = 'Celular de 10 dígitos que empiece por 3.';
		if (Object.keys(errores).length) return;

		const r = form.id ? datos.actualizarEmpresa(form.id, form) : datos.crearEmpresa(form);
		if (!r.ok) { errores = { [r.campo]: r.error }; errorGeneral = r.error; return; }
		mostrarForm = false;
	}

	let avisoBorrar = $state('');
	function borrar(id) {
		const r = datos.eliminarEmpresa(id);
		if (!r.ok) { avisoBorrar = r.error; setTimeout(() => (avisoBorrar = ''), 3500); }
	}
</script>

<div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
	<h4 class="fw-bold m-0"><i class="bi bi-building-fill me-2"></i>Empresas aliadas</h4>
	{#if puedeCrear}<button class="btn btn-primary" onclick={nueva}><i class="bi bi-plus-lg"></i> Registrar empresa</button>{/if}
</div>

{#if avisoBorrar}<div class="alert alert-danger py-2">{avisoBorrar}</div>{/if}

{#if mostrarForm}
	<form class="card p-4 mb-3 shadow-sm" onsubmit={guardar} novalidate>
		<h6 class="fw-bold mb-3">{form.id ? 'Editar empresa' : 'Registrar nueva empresa'}</h6>
		{#if errorGeneral}<div class="alert alert-danger py-2 small">{errorGeneral}</div>{/if}
		<div class="row g-3">
			<div class="col-md-6"><label class="form-label fw-semibold">Razón social</label><input class="form-control" class:is-invalid={errores.nombre} bind:value={form.nombre} /><div class="invalid-feedback">{errores.nombre}</div></div>
			<div class="col-md-3"><label class="form-label fw-semibold">NIT</label><input class="form-control" class:is-invalid={errores.nit} placeholder="900.123.456-7" bind:value={form.nit} /><div class="invalid-feedback">{errores.nit}</div></div>
			<div class="col-md-3"><label class="form-label fw-semibold">Sector</label><select class="form-select" bind:value={form.sector}>{#each SECTORES as s}<option>{s}</option>{/each}</select></div>
			<div class="col-md-4"><label class="form-label fw-semibold">Ciudad</label><input class="form-control" bind:value={form.ciudad} /></div>
			<div class="col-md-4"><label class="form-label fw-semibold">Persona de contacto</label><input class="form-control" bind:value={form.contacto} /></div>
			<div class="col-md-4"><label class="form-label fw-semibold">Celular de contacto</label><input class="form-control" class:is-invalid={errores.celular} maxlength="10" value={form.celular} oninput={(e) => (form.celular = e.target.value.replace(/\D/g, ''))} /><div class="invalid-feedback">{errores.celular}</div></div>
			<div class="col-md-6"><label class="form-label fw-semibold">Correo de contacto</label><input class="form-control" bind:value={form.correo} /></div>
			<div class="col-md-6"><label class="form-label fw-semibold">Sitio web</label><input class="form-control" bind:value={form.web} /></div>
		</div>
		<div class="mt-3 text-end"><button type="button" class="btn btn-light me-2" onclick={() => (mostrarForm = false)}>Cancelar</button><button class="btn btn-primary" type="submit">{form.id ? 'Guardar cambios' : 'Registrar'}</button></div>
	</form>
{/if}

<div class="card p-3 mb-3 shadow-sm"><div class="input-group"><span class="input-group-text"><i class="bi bi-search"></i></span><input class="form-control" placeholder="Nombre, sector o ciudad..." bind:value={q} /></div></div>

<div class="row g-3">
	{#each filtradas as e (e.id)}
		<div class="col-md-6 col-xl-4">
			<div class="card h-100 shadow-sm p-3">
				<div class="d-flex justify-content-between align-items-start mb-2">
					<div class="d-flex gap-2 align-items-center">
						<div class="logo-emp">{e.nombre[0]}</div>
						<div><div class="fw-bold">{e.nombre}</div><div class="text-muted small">{e.sector} · {e.ciudad}</div></div>
					</div>
					<span class="badge {e.estado === 'activa' ? 'bg-success' : 'bg-secondary'}">{e.estado}</span>
				</div>
				<div class="small mb-1"><i class="bi bi-person-fill text-primary"></i> {e.contacto || 'Sin contacto registrado'}</div>
				<div class="small mb-1"><i class="bi bi-envelope-fill text-secondary"></i> {e.correo}</div>
				<div class="small mb-2"><i class="bi bi-telephone-fill text-secondary"></i> {e.celular}</div>
				{#if puedeEditar || puedeBorrar}
					<div class="mt-auto d-flex gap-2">
						{#if puedeEditar}<button class="btn btn-sm btn-outline-primary" onclick={() => editar(e)}><i class="bi bi-pencil"></i> Editar</button>
							<button class="btn btn-sm btn-outline-secondary" onclick={() => datos.alternarEmpresa(e.id)}>{e.estado === 'activa' ? 'Desactivar' : 'Activar'}</button>{/if}
						{#if puedeBorrar}<button class="btn btn-sm btn-outline-danger" onclick={() => borrar(e.id)}><i class="bi bi-trash"></i></button>{/if}
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="col-12"><div class="card p-5 text-center text-muted">Sin resultados.</div></div>
	{/each}
</div>

<style>
	.logo-emp { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg,#d98a25,#f0b45a); color: #241a00; font-weight: 800; display: flex; align-items: center; justify-content: center; }
</style>
