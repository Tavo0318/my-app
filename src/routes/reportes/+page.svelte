<script>
	import { datos } from '$lib/stores/datos.svelte.js';

	let empleados = $derived(datos.egresados.filter((e) => e.estadoLaboral === 'Empleado').length);
	let tasa = $derived(datos.egresados.length ? Math.round((empleados / datos.egresados.length) * 100) : 0);
	let porArea = $derived(
		Object.entries(datos.vacantes.filter((v) => v.estado === 'abierta').reduce((acc, v) => ((acc[v.area] = (acc[v.area] ?? 0) + 1), acc), {})).sort((a, b) => b[1] - a[1])
	);
	let maxArea = $derived(Math.max(1, ...porArea.map((x) => x[1])));
	let contratados = $derived(datos.postulaciones.filter((p) => p.estado === 'Contratado').length);
	let porEmpresa = $derived(
		[...datos.empresas].map((e) => ({ nombre: e.nombre, n: datos.vacantes.filter((v) => v.empresaId === e.id && v.estado === 'abierta').length })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 6)
	);
	let maxEmp = $derived(Math.max(1, ...porEmpresa.map((x) => x.n)));
</script>

<h4 class="fw-bold mb-3"><i class="bi bi-bar-chart-fill me-2"></i>Reportes y analítica</h4>

<div class="row g-3 mb-3">
	<div class="col-6 col-md-3"><div class="acceso-card bg-g-green"><i class="bi bi-graph-up-arrow"></i><div class="n">{tasa}%</div><div>Tasa de empleabilidad</div></div></div>
	<div class="col-6 col-md-3"><div class="acceso-card bg-g-blue"><i class="bi bi-people-fill"></i><div class="n">{datos.egresados.length}</div><div>Egresados</div></div></div>
	<div class="col-6 col-md-3"><div class="acceso-card bg-g-amber"><i class="bi bi-building-fill"></i><div class="n">{datos.empresas.filter((e) => e.estado === 'activa').length}</div><div>Empresas aliadas</div></div></div>
	<div class="col-6 col-md-3"><div class="acceso-card bg-g-purple"><i class="bi bi-person-check-fill"></i><div class="n">{contratados}</div><div>Egresados contratados</div></div></div>
</div>

<div class="row g-3">
	<div class="col-lg-6"><div class="card p-4 shadow-sm h-100">
		<h6 class="fw-bold mb-3">Vacantes abiertas por área</h6>
		{#each porArea as [area, n]}
			<div class="mb-2"><div class="d-flex justify-content-between small"><span>{area}</span><strong>{n}</strong></div>
			<div class="progress" style="height:10px"><div class="progress-bar" style="width:{(n / maxArea) * 100}%"></div></div></div>
		{:else}<p class="text-muted small mb-0">No hay vacantes abiertas.</p>{/each}
	</div></div>
	<div class="col-lg-6"><div class="card p-4 shadow-sm h-100">
		<h6 class="fw-bold mb-3">Situación laboral de egresados</h6>
		<div class="d-flex justify-content-between small"><span>Empleados</span><strong>{empleados}</strong></div>
		<div class="progress mb-3" style="height:14px"><div class="progress-bar bg-success" style="width:{tasa}%"></div></div>
		<div class="d-flex justify-content-between small"><span>Buscando empleo</span><strong>{datos.egresados.length - empleados}</strong></div>
		<div class="progress" style="height:14px"><div class="progress-bar bg-warning" style="width:{100 - tasa}%"></div></div>
	</div></div>
	<div class="col-12"><div class="card p-4 shadow-sm">
		<h6 class="fw-bold mb-3">Empresas con más vacantes abiertas</h6>
		{#each porEmpresa as e}
			<div class="mb-2"><div class="d-flex justify-content-between small"><span>{e.nombre}</span><strong>{e.n}</strong></div>
			<div class="progress" style="height:10px"><div class="progress-bar bg-info" style="width:{(e.n / maxEmp) * 100}%"></div></div></div>
		{:else}<p class="text-muted small mb-0">No hay vacantes abiertas.</p>{/each}
	</div></div>
</div>
