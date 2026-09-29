<script>
	import { auth } from '$lib/stores/auth.svelte.js';
	import { datos } from '$lib/stores/datos.svelte.js';
	import { esCelular, esUrl } from '$lib/validar.js';
	import CambiarPassword from '$lib/components/CambiarPassword.svelte';

	const PROGRAMAS = ['Ingeniería de Sistemas', 'Ingeniería Industrial', 'Administración de Empresas', 'Contaduría Pública', 'Mercadeo y Publicidad', 'Enfermería', 'Derecho', 'Psicología'];
	const yo = auth.usuario?.nombre ?? '';
	const actual = datos.egresados.find((e) => e.id === auth.usuario?.id);

	let f = $state({
		celular: actual?.celular ?? '', ciudad: actual?.ciudad ?? '', programa: actual?.programa ?? '',
		anio: actual?.anio ?? '', cargoDeseado: actual?.cargoDeseado ?? '', resumen: actual?.resumen ?? '',
		cv: actual?.cv ?? '', estadoLaboral: actual?.estadoLaboral ?? 'Buscando'
	});
	let errores = $state({});
	let guardado = $state(false);

	const campos = ['celular', 'ciudad', 'programa', 'anio', 'cargoDeseado', 'resumen', 'cv'];
	let completitud = $derived(Math.round((campos.filter((c) => String(f[c] ?? '').trim()).length / campos.length) * 100));
	const iniciales = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');

	function guardar(e) {
		e.preventDefault();
		errores = {}; guardado = false;
		if (!esCelular(f.celular)) errores.celular = 'Celular de 10 dígitos que empiece por 3.';
		if (f.ciudad.trim().length < 2) errores.ciudad = 'Ingresa tu ciudad.';
		if (!f.programa) errores.programa = 'Selecciona tu programa.';
		if (!esUrl(f.cv)) errores.cv = 'Ingresa un enlace válido que empiece por http:// o https://';
		if (f.resumen.length > 300) errores.resumen = 'Máximo 300 caracteres.';
		if (Object.keys(errores).length) return;
		const r = datos.actualizarEgresado(auth.usuario.id, { ...f, anio: Number(f.anio) });
		if (!r.ok) { errores[r.campo ?? 'celular'] = r.error; return; }
		guardado = true;
		setTimeout(() => (guardado = false), 3000);
	}
</script>

<div class="card p-4 shadow-sm mb-3 d-flex flex-row align-items-center gap-3 flex-wrap">
	<div class="avatar">{iniciales(yo)}</div>
	<div class="flex-grow-1">
		<h4 class="fw-bold m-0">{yo}</h4>
		<div class="text-muted small"><i class="bi bi-envelope-fill"></i> {auth.usuario?.correo}</div>
	</div>
	<div style="min-width:220px;">
		<div class="d-flex justify-content-between small"><span>Perfil completo</span><strong>{completitud}%</strong></div>
		<div class="progress" style="height:10px;"><div class="progress-bar {completitud === 100 ? 'bg-success' : 'bg-warning'}" style="width:{completitud}%"></div></div>
	</div>
</div>

<form class="card p-4 shadow-sm" style="max-width:820px;" onsubmit={guardar} novalidate>
	<h5 class="fw-bold mb-3"><i class="bi bi-person-lines-fill me-2"></i>Mi perfil profesional</h5>
	<div class="row g-3">
		<div class="col-md-6"><label class="form-label fw-semibold">Correo (no editable)</label><input class="form-control" value={auth.usuario?.correo} disabled /></div>
		<div class="col-md-6"><label class="form-label fw-semibold" for="cel">Celular</label>
			<div class="input-group has-validation"><span class="input-group-text">+57</span><input id="cel" class="form-control" class:is-invalid={errores.celular} maxlength="10" inputmode="numeric" value={f.celular} oninput={(e) => (f.celular = e.target.value.replace(/\D/g, ''))} /><div class="invalid-feedback">{errores.celular}</div></div></div>
		<div class="col-md-6"><label class="form-label fw-semibold" for="prog">Programa académico</label><select id="prog" class="form-select" class:is-invalid={errores.programa} bind:value={f.programa}><option value="">Selecciona...</option>{#each PROGRAMAS as p}<option>{p}</option>{/each}</select><div class="invalid-feedback">{errores.programa}</div></div>
		<div class="col-md-3"><label class="form-label fw-semibold" for="anio">Año de grado</label><input id="anio" type="number" class="form-control" bind:value={f.anio} /></div>
		<div class="col-md-3"><label class="form-label fw-semibold" for="ciu">Ciudad</label><input id="ciu" class="form-control" class:is-invalid={errores.ciudad} bind:value={f.ciudad} /><div class="invalid-feedback">{errores.ciudad}</div></div>
		<div class="col-md-6"><label class="form-label fw-semibold" for="cargo">Cargo deseado</label><input id="cargo" class="form-control" placeholder="Ej: Analista de datos" bind:value={f.cargoDeseado} /></div>
		<div class="col-md-6"><label class="form-label fw-semibold" for="est">Situación laboral</label><select id="est" class="form-select" bind:value={f.estadoLaboral}><option>Buscando</option><option>Empleado</option></select></div>
		<div class="col-12"><label class="form-label fw-semibold" for="cv">Enlace a tu hoja de vida (LinkedIn, Drive...)</label><input id="cv" class="form-control" class:is-invalid={errores.cv} placeholder="https://..." bind:value={f.cv} /><div class="invalid-feedback">{errores.cv}</div></div>
		<div class="col-12"><label class="form-label fw-semibold" for="res">Resumen profesional <span class="text-muted small">({f.resumen.length}/300)</span></label><textarea id="res" rows="3" class="form-control" class:is-invalid={errores.resumen} bind:value={f.resumen}></textarea><div class="invalid-feedback">{errores.resumen}</div></div>
	</div>
	<div class="mt-3 d-flex align-items-center gap-3">
		<button class="btn btn-primary" type="submit"><i class="bi bi-save me-1"></i> Guardar cambios</button>
		{#if guardado}<span class="text-success small"><i class="bi bi-check-circle-fill"></i> Perfil actualizado</span>{/if}
	</div>
</form>

<CambiarPassword />

<style>
	.avatar { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #0a6b61, #14c2ac); color: #fff; font-weight: 800; font-size: 22px; display: flex; align-items: center; justify-content: center; }
</style>
