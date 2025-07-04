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
                            // ✅ Guardamos el rol y el usuario completo
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

//De acuerdo al rol puede eliminar y agregar maquinas
document.addEventListener('DOMContentLoaded', () => {
    const rol = localStorage.getItem('rol')?.toLowerCase(); // sigue usando tu lógica original

    const addMachineBtn = document.getElementById('addMachineBtn');
    const deleteMachineBtn = document.getElementById('deleteMachineBtn');

    if (rol !== 'admin') {
        if (addMachineBtn) addMachineBtn.style.display = 'none';
        if (deleteMachineBtn) deleteMachineBtn.style.display = 'none';
    }
});

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



