<script>
	import { datos } from '$lib/stores/datos.svelte.js';

	let busqueda = $state('');
	let programa = $state('Todos');
	let estado = $state('Todos');

	let programas = $derived([...new Set(datos.egresados.map((e) => e.programa))]);
	let filtrados = $derived(
		datos.egresados
			.filter((e) => programa === 'Todos' || e.programa === programa)
			.filter((e) => estado === 'Todos' || e.estadoLaboral === estado)
			.filter((e) => (e.nombre + ' ' + e.cargoDeseado).toLowerCase().includes(busqueda.toLowerCase()))
	);
	const iniciales = (n) => n.split(' ').map((p) => p[0]).slice(0, 2).join('');
</script>

<h4 class="fw-bold mb-3"><i class="bi bi-people-fill me-2"></i>Directorio de Egresados</h4>

<div class="card p-3 mb-3 shadow-sm">
	<div class="row g-2">
		<div class="col-md-5"><div class="input-group"><span class="input-group-text"><i class="bi bi-search"></i></span><input class="form-control" placeholder="Nombre o cargo deseado..." bind:value={busqueda} /></div></div>
		<div class="col-md-4"><select class="form-select" bind:value={programa}><option value="Todos">Todos los programas</option>{#each programas as p}<option>{p}</option>{/each}</select></div>
		<div class="col-md-3"><select class="form-select" bind:value={estado}><option value="Todos">Todos</option><option>Buscando</option><option>Empleado</option></select></div>
	</div>
</div>

<p class="text-muted small">{filtrados.length} egresado(s)</p>
<div class="row g-3">
	{#each filtrados as e (e.id)}
		<div class="col-md-6 col-xl-4">
			<div class="card h-100 shadow-sm p-3">
				<div class="d-flex gap-3 align-items-center mb-2">
					<div class="avatar">{iniciales(e.nombre)}</div>
					<div><div class="fw-bold">{e.nombre}</div><div class="text-muted small">{e.programa}</div></div>
				</div>
				<div class="small mb-1"><i class="bi bi-bullseye text-primary"></i> {e.cargoDeseado || 'Sin definir'}</div>
				<div class="small mb-2"><i class="bi bi-geo-alt-fill text-danger"></i> {e.ciudad} &nbsp; <i class="bi bi-mortarboard text-secondary"></i> Promoción {e.anio}</div>
				<div class="d-flex justify-content-between align-items-center">
					<span class="badge {e.estadoLaboral === 'Empleado' ? 'bg-success' : 'bg-warning text-dark'}">{e.estadoLaboral === 'Empleado' ? `Empleado en ${e.empresaActual || '—'}` : 'Buscando empleo'}</span>
				</div>
			</div>
		</div>
	{:else}
		<div class="col-12"><div class="card p-5 text-center text-muted">Sin resultados.</div></div>
	{/each}
</div>

<style>
	.avatar { width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(135deg,#3a5fb8,#128f83); color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; }
</style>
