function hideLogin() { // Evento para ocultar el login y mostrar contenido principal
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer) loginContainer.style.display = 'none';

    const mainContent = document.getElementById('mainContent');
    if (mainContent) mainContent.style.display = 'block';
}

// Evento para mostrar u ocultar el sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleButton = document.querySelector('.toggle-sidebar');
    const toggleIcon = document.getElementById('toggleIcon');

    if (sidebar && mainContent && toggleButton && toggleIcon) {
        sidebar.classList.toggle('hidden');
        sidebar.classList.toggle('visible');
        mainContent.classList.toggle('expanded');
        toggleButton.classList.toggle('active');

        toggleIcon.classList.toggle('fa-bars');
        toggleIcon.classList.toggle('fa-times');
    }
}

// Evento para cambiar entre módulos de reportes y notificaciones
function showModule(module) {
    const reportesModule = document.getElementById('reportesModule');
    const notificacionesModule = document.getElementById('notificacionesModule');

    if (reportesModule) reportesModule.style.display = module === 'reportes' ? 'block' : 'none';
    if (notificacionesModule) notificacionesModule.style.display = module === 'notificaciones' ? 'block' : 'none';

    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(li => li.classList.remove('active'));
    const currentItem = document.querySelector(`.sidebar-menu li[data-module="${module}"]`);
    if (currentItem) currentItem.classList.add('active');

    if (module === 'notificaciones') cargarNotificaciones();
}

// Evento para cerrar sesión
function logout() {
    Swal.fire({
        icon: 'success',
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        timer: 1500,
        showConfirmButton: false
    }).then(() => {
        localStorage.removeItem('rol');
        window.location.href = '/login.html';
    });
}


document.addEventListener('DOMContentLoaded', function () {

    // Evento para ocultar módulo de notificaciones si es operario
    const storedRol = localStorage.getItem('rol');
    if (storedRol === 'operario') {
        const notificacionesModule = document.getElementById('notificacionesModule');
        const notificacionesMenu = document.querySelector('li[data-module="notificaciones"]');
        if (notificacionesModule) notificacionesModule.style.display = 'none';
        if (notificacionesMenu) notificacionesMenu.style.display = 'none';
    }

    // Evento para el formulario login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;
            const rol = document.getElementById('rol')?.value;

            if (username && password && rol) {
                fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                })
                    .then(response => {
                        if (!response.ok) throw new Error('Credenciales inválidas');
                        return response.json();
                    })
                    .then(data => {
                        if (data.user && data.user.rol === rol) {
                            localStorage.setItem('rol', data.user.rol);
                            localStorage.setItem('user', JSON.stringify(data.user));

                            Swal.fire({
                                icon: 'success',
                                title: '¡Bienvenido!',
                                text: `Has iniciado sesión como ${data.user.rol}`,
                                timer: 2000,
                                showConfirmButton: false
                            }).then(() => {
                                window.location.href = '/index.html';
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Rol incorrecto',
                                text: 'El rol seleccionado no coincide con el usuario',
                            });
                        }
                    })
                    .catch(err => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error de inicio de sesión',
                            text: err.message
                        });
                    });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, complete todos los campos.'
                });
            }
        });
    }


    const toggleButton = document.querySelector('.toggle-sidebar');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSidebar);
    }

    // Evento para cambiar de modulos en el menu principal
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', function () {
                const module = this.getAttribute('data-module');
                if (module) showModule(module);
            });
        });
    }

    // Evento de cierre de sesión
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});


// Evento para agregar maquina nueva
const addMachineBtn = document.getElementById('addMachineBtn');
const modalNuevaMaquina = document.getElementById('modalNuevaMaquina');
const cancelMachineBtn = document.getElementById('cancelMachineBtn');
const saveMachineBtn = document.getElementById('saveMachineBtn');
const newMachineName = document.getElementById('newMachineName');
const newMachineDesc = document.getElementById('newMachineDesc');
const machineSelect = document.getElementById('machineSelect');

// Mostrar modal
if (addMachineBtn) {
    addMachineBtn.addEventListener('click', () => {
        newMachineName.value = '';
        newMachineDesc.value = '';
        modalNuevaMaquina.style.display = 'flex';
    });
}

// Cancelar modal
if (cancelMachineBtn) {
    cancelMachineBtn.addEventListener('click', () => {
        modalNuevaMaquina.style.display = 'none';
    });
}

// Evento parar guardar maquina nueva
if (saveMachineBtn) {
    saveMachineBtn.addEventListener('click', async () => {
        const nombre = newMachineName.value.trim();
        const descripcion = newMachineDesc.value.trim();

        if (!nombre) {
            Swal.fire({
                icon: 'warning',
                title: 'Nombre requerido',
                text: 'Por favor ingrese el nombre de la máquina'
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/maquinas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, descripcion })
            });

            if (!response.ok) throw new Error('Error al crear la máquina');

            const data = await response.json();
            const nuevaMaquina = data.maquina;

            const option = document.createElement('option');
            option.value = nuevaMaquina.id;
            option.textContent = nuevaMaquina.nombre;
            machineSelect.appendChild(option);
            machineSelect.value = nuevaMaquina.id;

            Swal.fire({
                icon: 'success',
                title: 'Máquina agregada',
                text: 'La máquina se ha agregado correctamente'
            });

            modalNuevaMaquina.style.display = 'none';

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo agregar la máquina'
            });
        }
    });
}

async function cargarMaquinasEnSelect() {
    try {
        const response = await fetch('http://localhost:3000/api/maquinas');
        const maquinas = await response.json();

        const machineSelect = document.getElementById('machineSelect');
        machineSelect.innerHTML = '<option value=""> Seleccione una maquinas </option>';

        maquinas.forEach(maquina => {
            const option = document.createElement('option');
            option.value = maquina.id
            option.textContent = maquina.nombre;
            machineSelect.appendChild(option);
        })
    } catch (error) {
        console.error({ error: 'Error al cargar las maquinas', error })
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarMaquinasEnSelect();
});

//Evento para eliminar maquina
const deleteMachineBtn = document.getElementById('deleteMachineBtn');

if (deleteMachineBtn) {
    deleteMachineBtn.addEventListener('click', async () => {
        const selectedId = machineSelect.value;
        const selectedText = machineSelect.options[machineSelect.selectedIndex]?.textContent;

        if (!selectedId) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecciona una máquina',
                text: 'Debes seleccionar una máquina para eliminar'
            });
            return;
        }

        const confirm = await Swal.fire({
            title: `¿Eliminar "${selectedText}"?`,
            text: "Estas seguro que quieres eliminar esta maquina",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/maquinas/${selectedId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Error al eliminar máquina');


                machineSelect.querySelector(`option[value="${selectedId}"]`)?.remove();

                Swal.fire({
                    icon: 'success',
                    title: 'Máquina eliminada',
                    text: `"${selectedText}" fue eliminada correctamente`
                });

                machineSelect.value = '';
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo eliminar la máquina'
                });
            }
        }
    });
}

// Evento para verificar acciones de acuerdo al rol
document.addEventListener('DOMContentLoaded', () => {
    const rol = localStorage.getItem('rol')?.toLowerCase();

    const addMachineBtn = document.getElementById('addMachineBtn');
    const deleteMachineBtn = document.getElementById('deleteMachineBtn');

    if (rol !== 'admin') {
        if (addMachineBtn) addMachineBtn.style.display = 'none';
        if (deleteMachineBtn) deleteMachineBtn.style.display = 'none';
    }
});

//Evento de mensaje de bienvenida
document.addEventListener('DOMContentLoaded', () => {
    const welcomeDiv = document.getElementById('sidebar-welcome');
    const rol = localStorage.getItem('rol');
    const user = JSON.parse(localStorage.getItem('user'));

    if (welcomeDiv && user?.username) {
        welcomeDiv.textContent = `Bienvenid@, ${user.username}`;
        welcomeDiv.style.marginTop = '20px';
        welcomeDiv.style.padding = '10px';
        welcomeDiv.style.color = '#fff';
        welcomeDiv.style.fontWeight = '500';
        welcomeDiv.style.textAlign = 'center';
    }
});

//Evento para enviar el reporte
document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.querySelector('.reportes-form');

    if (reportForm) {
        reportForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error de usuario',
                    text: 'No se pudo obtener el ID del usuario.'
                });
                return;
            }

            const maquinaSelect = document.getElementById('machineSelect');
            const fechaHoraInput = document.getElementById('incidentDateTime');
            const causas = document.getElementById('failureCause').value.trim();
            const nivelPeligro = document.getElementById('dangerLevel').value;
            const descripcion = document.getElementById('incidentDescription').value.trim();
            const imagenFile = document.getElementById('imagen').files[0];

            const maquinaId = maquinaSelect.value;
            const nombreMaquina = maquinaSelect.selectedOptions[0]?.textContent || 'Sin nombre';
            const fechaHora = fechaHoraInput.value;

            // Validar campos
            if (!maquinaId || !fechaHora || !causas || !nivelPeligro || !descripcion || !imagenFile) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor, completa todos los campos y adjunta la evidencia.'
                });
                return;
            }

            // Validar fecha y hora
            if (!fechaHora.includes('T')) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Fecha y hora inválida',
                    text: 'Selecciona una fecha y hora válida.'
                });
                return;
            }

            let [fecha, hora] = fechaHora.split('T');
            if (hora.length === 5) hora += ':00';

            const formData = new FormData();
            formData.append('usuario_id', user.id);
            formData.append('maquina_id', parseInt(maquinaId));
            formData.append('nombre_maquina', nombreMaquina);
            formData.append('fecha_incidente', fecha);
            formData.append('hora_incidente', hora);
            formData.append('causas', causas);
            formData.append('nivel_peligro', nivelPeligro);
            formData.append('descripcion', descripcion);
            formData.append('imagen', imagenFile); // Aquí se adjunta la imagen

            try {
                const response = await fetch('http://localhost:3000/api/enviar-reporte', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Error al enviar el reporte.');

                const result = await response.json();
                Swal.fire({
                    icon: 'success',
                    title: 'Reporte enviado',
                    text: result.message || 'Se ha enviado correctamente el reporte.'
                });

                reportForm.reset();

            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo enviar el reporte.'
                });
            }
        });
    }
});


// Evento para cargar notificaciones
async function cargarNotificaciones() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.id) return;

  try {
    const response = await fetch(`http://localhost:3000/api/notificaciones/${user.id}`);
    const notificaciones = await response.json();

    const contenedor = document.getElementById('contenedor-notificaciones');
    contenedor.innerHTML = '';

    if (notificaciones.length === 0) {
      contenedor.innerHTML = '<p>No tienes notificaciones.</p>';
      return;
    }

    notificaciones.forEach(noti => {
      const fechaFormateada = new Date(noti.creada_en).toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        hour12: true,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const card = document.createElement('div');
      card.classList.add('notification-card');
      card.innerHTML = `
        <h3>Notificación</h3>
        <p>${noti.mensaje}</p>
        <small>${fechaFormateada}</small>
      `;

      card.addEventListener('click', () => {
        if (!noti.id || isNaN(noti.id)) {
          console.error("ID inválido en notificación:", noti);
          return;
        }
        mostrarDetalleNotificacion(noti.id);
      });

      contenedor.appendChild(card);
    });

  } catch (error) {
    console.error('Error al cargar notificaciones:', error);
  }
}

// Mostrar modal con detalle del reporte
async function mostrarDetalleNotificacion(idNotificacion) {
  try {
    const response = await fetch(`http://localhost:3000/api/detalle-reporte/${idNotificacion}`);
    if (!response.ok) throw new Error('No se pudo obtener el detalle del reporte');

    const data = await response.json();

    document.getElementById('detalle-maquina').textContent = data.nombre_maquina || '';
    document.getElementById('detalle-fecha').textContent = data.fecha_incidente?.split('T')[0] || '';
    document.getElementById('detalle-hora').textContent = data.hora_incidente || '';
    document.getElementById('detalle-peligro').textContent = data.nivel_peligro || '';
    document.getElementById('detalle-causa').textContent = data.causas || '';
    document.getElementById('detalle-descripcion').textContent = data.descripcion || '';

    const imagen = document.getElementById('detalle-imagen');
    if (data.imagen_path) {
      imagen.src = `http://localhost:3000/${data.imagen_path}`;
      imagen.style.display = 'block';
    } else {
      imagen.style.display = 'none';
    }

    document.getElementById('modalDetalleNotificacion').style.display = 'flex';

  } catch (error) {
    console.error('Error al mostrar detalle:', error);
  }
}

// Cerrar modal
document.getElementById("cerrarModalDetalle").addEventListener("click", () => {
  document.getElementById("modalDetalleNotificacion").style.display = "none";
});