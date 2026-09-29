<script>
	import { datos } from '$lib/stores/datos.svelte.js';
	import { ROLES, MODULOS, ACCIONES } from '$lib/permisos.js';

	const permisoDe = (rol, modulo) => datos.permisos.find((p) => p.rol === rol && p.modulo === modulo);
	function alternar(rol, modulo, accion) {
		const p = permisoDe(rol, modulo);
		datos.setPermiso(rol, modulo, accion, !p[accion]);
	}
	let rolActivo = $state('coordinador');
</script>

<h4 class="fw-bold mb-1"><i class="bi bi-shield-check me-2"></i>Roles y permisos</h4>
<p class="text-muted mb-3">Define qué puede ver, crear, actualizar o eliminar cada rol en cada módulo. Los cambios se aplican de inmediato al menú y a los botones de toda la plataforma.</p>

<div class="row g-3 mb-3">
	{#each Object.entries(ROLES) as [id, r]}
		<div class="col-md-4">
			<div class="card p-3 shadow-sm role-card" class:sel={rolActivo === id} style="--c:{r.color}" role="button" tabindex="0" onclick={() => (rolActivo = id)} onkeydown={(e) => e.key === 'Enter' && (rolActivo = id)}>
				<div class="d-flex align-items-center gap-2"><i class="bi {r.icono} fs-4" style="color:{r.color}"></i><h6 class="fw-bold m-0">{r.nombre}</h6></div>
				<p class="text-muted small mb-0 mt-1">{r.descripcion}</p>
			</div>
		</div>
	{/each}
</div>

<div class="card shadow-sm">
	<div class="table-responsive">
		<table class="table align-middle mb-0">
			<thead class="table-light">
				<tr><th>Módulo</th>{#each ACCIONES as [id, label]}<th class="text-center">{label}</th>{/each}</tr>
			</thead>
			<tbody>
				{#each MODULOS as m}
					{@const p = permisoDe(rolActivo, m.id)}
					<tr>
						<td><i class="bi {m.icono} me-2 text-muted"></i><strong>{m.nombre}</strong><div class="text-muted small">{m.desc}</div></td>
						{#each ACCIONES as [accion]}
							<td class="text-center">
								<div class="form-check form-switch d-flex justify-content-center">
									<input class="form-check-input" type="checkbox" checked={p[accion]}
										disabled={rolActivo === 'admin' && m.id === 'roles' && (accion === 'ver' || accion === 'actualizar')}
										onchange={() => alternar(rolActivo, m.id, accion)} />
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<div class="d-flex justify-content-between align-items-center mt-3">
	<p class="text-muted small mb-0"><i class="bi bi-info-circle"></i> El Administrador siempre conserva acceso a esta pantalla para evitar bloquear el sistema.</p>
	<button class="btn btn-outline-secondary btn-sm" onclick={() => datos.restablecerPermisos()}><i class="bi bi-arrow-counterclockwise"></i> Restablecer permisos por defecto</button>
</div>

<style>
	.role-card { cursor: pointer; border: 2px solid transparent; transition: all .15s ease; }
	.role-card:hover { border-color: var(--c); }
	.role-card.sel { border-color: var(--c); background: color-mix(in srgb, var(--c) 8%, white); }
</style>
