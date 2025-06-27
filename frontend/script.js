// Funciones principales
function hideLogin() {
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer) {
        loginContainer.style.display = 'none';
    }
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
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

        if (toggleButton.classList.contains('active')) {
            toggleIcon.classList.remove('fa-bars');
            toggleIcon.classList.add('fa-times');
        } else {
            toggleIcon.classList.remove('fa-times');
            toggleIcon.classList.add('fa-bars');
        }
    }
}

function showModule(module) {
    const reportesModule = document.getElementById('reportesModule');
    const notificacionesModule = document.getElementById('notificacionesModule');

    if (reportesModule) reportesModule.style.display = module === 'reportes' ? 'block' : 'none';
    if (notificacionesModule) notificacionesModule.style.display = module === 'notificaciones' ? 'block' : 'none';

    const menuItems = document.querySelectorAll('.sidebar-menu li');
    if (menuItems) {
        menuItems.forEach(li => li.classList.remove('active'));
        const currentItem = document.querySelector(`.sidebar-menu li[data-module="${module}"]`);
        if (currentItem) currentItem.classList.add('active');
    }
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
    alert('Reporte enviado (funcionalidad simulada)');
    console.log(formData);
    const form = event.target;
    if (form) form.reset();
}

function logout() {
    const loginContainer = document.getElementById('loginContainer');
    if (loginContainer) {
        alert('Cerrar sesión (funcionalidad simulada)');
        loginContainer.style.display = 'flex';
        const mainContent = document.getElementById('mainContent');
        const sidebar = document.getElementById('sidebar');
        if (mainContent) mainContent.style.display = 'none';
        if (sidebar) {
            sidebar.classList.remove('visible');
            sidebar.classList.add('hidden');
        }
    }
}

// Inicialización de eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Evento para el formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username')?.value;
            const password = document.getElementById('password')?.value;
            if (username && password) {
                hideLogin();
            } else {
                alert('Por favor, complete todos los campos.');
            }
        });
    }

    // Evento para el botón de hamburguesa
    const toggleButton = document.querySelector('.toggle-sidebar');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleSidebar);
    }

    // Evento para los ítems del menú lateral
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            item.addEventListener('click', function(event) {
                const module = this.getAttribute('data-module');
                if (module) showModule(module);
            });
        });
    }

    // Evento para el formulario de reportes
    const reportForm = document.querySelector('.reportes-form');
    if (reportForm) {
        reportForm.addEventListener('submit', submitReport);
    }

    // Evento para el botón de logout
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});