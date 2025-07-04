function hideLogin() {
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer) loginContainer.style.display = 'none';

    const mainContent = document.getElementById('mainContent');
    if (mainContent) mainContent.style.display = 'block';
}

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

function showModule(module) {
    const reportesModule = document.getElementById('reportesModule');
    const notificacionesModule = document.getElementById('notificacionesModule');

    if (reportesModule) reportesModule.style.display = module === 'reportes' ? 'block' : 'none';
    if (notificacionesModule) notificacionesModule.style.display = module === 'notificaciones' ? 'block' : 'none';

    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(li => li.classList.remove('active'));
    const currentItem = document.querySelector(`.sidebar-menu li[data-module="${module}"]`);
    if (currentItem) currentItem.classList.add('active');
}

function submitReport(event) {
    event.preventDefault();
    const formData = {
        machineName: document.getElementById('machineName')?.value || '',
        incidentDateTime: document.getElementById('incidentDateTime')?.value || '',
        failureCause: document.getElementById('failureCause')?.value || '',
        dangerLevel: document.getElementById('dangerLevel')?.value || 'baja',
        incidentDescription: document.getElementById('incidentDescription')?.value || '',
        evidence: document.getElementById('evidence')?.files[0] || null
    };
    Swal.fire('¡Reporte enviado!', 'Este es un ejemplo simulado.', 'success');
    console.log(formData);
    event.target.reset();
}

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
                            localStorage.setItem('rol', data.user.rol); // Guardar rol
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

    const menuItems = document.querySelectorAll('.sidebar-menu li');
    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', function () {
                const module = this.getAttribute('data-module');
                if (module) showModule(module);
            });
        });
    }

    const reportForm = document.querySelector('.reportes-form');
    if (reportForm) {
        reportForm.addEventListener('submit', submitReport);
    }

    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});

// ============================
// FUNCIONALIDAD: MÁQUINAS
// ============================

const rolActual = localStorage.getItem('rol');
const selectMaquina = document.getElementById('machineSelect');
const addMachineBtn = document.getElementById('addMachineBtn');
const modal = document.getElementById('modalNuevaMaquina');
const saveMachineBtn = document.getElementById('saveMachineBtn');
const cancelMachineBtn = document.getElementById('cancelMachineBtn');
const newMachineName = document.getElementById('newMachineName');
const newMachineDesc = document.getElementById('newMachineDesc');

// Ocultar botón y modal para operario
if (rolActual === 'operario') {
    if (addMachineBtn) addMachineBtn.style.display = 'none';
    if (modal) modal.style.display = 'none';
}

// Cargar máquinas existentes en el select
if (selectMaquina) {
    fetch('http://localhost:3000/api/maquinas')
        .then(res => res.json())
        .then(maquinas => {
            maquinas.forEach(m => {
                const option = document.createElement('option');
                option.value = m.id;
                option.textContent = m.nombre;
                selectMaquina.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error al cargar máquinas:', err);
            Swal.fire('Error', 'No se pudieron cargar las máquinas', 'error');
        });
}

// Mostrar modal
// Mostrar modal al dar clic en el botón +
if (addMachineBtn) {
    addMachineBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'flex'; // activa el modal centrado
    });
}


// Ocultar modal
if (cancelMachineBtn) {
    cancelMachineBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
        newMachineName.value = '';
        newMachineDesc.value = '';
    });
}

// Guardar nueva máquina (simulado)
if (saveMachineBtn) {
    saveMachineBtn.addEventListener('click', () => {
        const nombre = newMachineName.value.trim();
        const descripcion = newMachineDesc.value.trim();

        if (!nombre) {
            Swal.fire('Nombre obligatorio', 'Ingresa el nombre de la máquina', 'warning');
            return;
        }

        // Aquí se enviará luego al backend
        Swal.fire('Guardado', 'La máquina fue creada (simulado)', 'success');

        modal.style.display = 'none';
        newMachineName.value = '';
        newMachineDesc.value = '';

        // Agregar la nueva máquina al select (simulado)
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = '0'; // Temporal, se reemplazará al tener el ID real del backend
        nuevaOpcion.textContent = nombre;
        selectMaquina.appendChild(nuevaOpcion);
    });
}

