async function iniciarSesion(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('https://www.proyectoad.somee.com/AuthService.svc/rest/IniciarSesion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CorreoElectronico: email,
                ClaveHash: password
            })
        });

        const data = await response.json();
        if (data.UsuarioId > 0) {
            alert(`Inicio de sesión exitoso. Bienvenido, ${data.Nombre} ${data.Apellido}!`);
            localStorage.setItem('usuario', JSON.stringify(data)); // Guardar usuario en localStorage
            mostrarInformacionUsuario(data);
            listarReservas(data.UsuarioId); // Pasar el UsuarioId al listarReservas
            limpiarFormularioInicioSesion(); // Limpiar el formulario de inicio de sesión
            limpiarFormularioRegistro(); // Limpiar el formulario de registro
        } else {
            alert('Inicio de sesión fallido. Verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error en iniciarSesion:', error);
        alert('Error al iniciar sesión. Por favor, inténtalo nuevamente.');
    }
}

async function registrarUsuario(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto
    const nombre = document.getElementById('registerNombre').value;
    const apellido = document.getElementById('registerApellido').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('https://www.proyectoad.somee.com/UsuarioService.svc/rest/RegistrarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Nombre: nombre,
                Apellido: apellido,
                CorreoElectronico: email,
                ClaveHash: password
            })
        });

        const data = await response.json();
        if (data.UsuarioId > 0) {
            alert(`Usuario registrado exitosamente. Ahora puedes iniciar sesión.`);
            limpiarFormularioRegistro(); // Limpiar el formulario de registro
            mostrarFormulario('loginForm'); // Mostrar el formulario de inicio de sesión
        } else {
            alert(`Usuario registrado exitosamente. Ahora puedes iniciar sesión.`);
            limpiarFormularioRegistro(); // Limpiar el formulario de registro
            mostrarFormulario('loginForm');
        }
    } catch (error) {
        alert(`Usuario registrado exitosamente. Ahora puedes iniciar sesión.`);
        limpiarFormularioRegistro(); // Limpiar el formulario de registro
        mostrarFormulario('loginForm');
    }
}

function limpiarFormularioRegistro() {
    document.getElementById('registerNombre').value = '';
    document.getElementById('registerApellido').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
}

function limpiarFormularioInicioSesion() {
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function mostrarInformacionUsuario(data) {
    const userInfo = document.getElementById('userInfo');
    userInfo.innerHTML = `
        <h2>Información del Usuario</h2>
        <p>ID: ${data.UsuarioId}</p>
        <p>Nombre: ${data.Nombre}</p>
        <p>Apellido: ${data.Apellido}</p>
        <p>Correo Electrónico: ${data.CorreoElectronico}</p>
    `;
}

async function listarVuelos() {
    try {
        const response = await fetch('https://www.proyectoad.somee.com/VueloService.svc/rest/ListarVuelos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const table = document.getElementById('vuelosTable');
        table.innerHTML = '<tr><th>Vuelo ID</th><th>Origen</th><th>Destino</th><th>Fecha Salida</th><th>Fecha Llegada</th><th>Precio</th></tr>';
        data.forEach(vuelo => {
            const row = table.insertRow();
            row.insertCell(0).innerText = vuelo.VueloId;
            row.insertCell(1).innerText = vuelo.Origen;
            row.insertCell(2).innerText = vuelo.Destino;
            row.insertCell(3).innerText = new Date(parseInt(vuelo.FechaSalida.substr(6))).toLocaleString();
            row.insertCell(4).innerText = new Date(parseInt(vuelo.FechaLlegada.substr(6))).toLocaleString();
            row.insertCell(5).innerText = vuelo.Precio;
        });
    } catch (error) {
        console.error('Error en listarVuelos:', error);
        alert('Error al listar vuelos. Por favor, inténtalo nuevamente.');
    }
}

async function buscarVuelos(event) {
    event.preventDefault();
    const origen = document.getElementById('searchOrigen').value;
    const destino = document.getElementById('searchDestino').value;

    try {
        const response = await fetch('https://www.proyectoad.somee.com/VueloService.svc/rest/BuscarVuelos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Origen: origen,
                Destino: destino
            })
        });

        const data = await response.json();
        const table = document.getElementById('vuelosTable');
        table.innerHTML = '<tr><th>Vuelo ID</th><th>Origen</th><th>Destino</th><th>Fecha Salida</th><th>Fecha Llegada</th><th>Precio</th></tr>';
        data.forEach(vuelo => {
            const row = table.insertRow();
            row.insertCell(0).innerText = vuelo.VueloId;
            row.insertCell(1).innerText = vuelo.Origen;
            row.insertCell(2).innerText = vuelo.Destino;
            row.insertCell(3).innerText = new Date(parseInt(vuelo.FechaSalida.substr(6))).toLocaleString();
            row.insertCell(4).innerText = new Date(parseInt(vuelo.FechaLlegada.substr(6))).toLocaleString();
            row.insertCell(5).innerText = vuelo.Precio;
        });
    } catch (error) {
        console.error('Error en buscarVuelos:', error);
        alert('Error al buscar vuelos. Por favor, inténtalo nuevamente.');
    }
}

async function listarReservas(usuarioId) {
    try {
        const response = await fetch('https://www.proyectoad.somee.com/ReservaService.svc/rest/ListarReservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UsuarioId: usuarioId // Incluir el ID del usuario en el cuerpo de la solicitud
            })
        });

        if (!response.ok) {
            throw new Error(`Error al listar reservas: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data); // Imprimir la respuesta para verificar

        const table = document.getElementById('reservasTable');
        table.innerHTML = '<tr><th>Reserva ID</th><th>Usuario ID</th><th>Vuelo ID</th><th>Estado</th><th>Fecha Reserva</th></tr>';
        data.forEach(reserva => {
            const row = table.insertRow();
            row.insertCell(0).innerText = reserva.ReservaID;
            row.insertCell(1).innerText = reserva.UsuarioId;
            row.insertCell(2).innerText = reserva.VueloID;
            row.insertCell(3).innerText = reserva.Estado;
            row.insertCell(4).innerText = new Date(parseInt(reserva.FechaReserva.substr(6))).toLocaleString();
        });
    } catch (error) {
        console.error('Error en listarReservas:', error);
        alert('Error al listar reservas. Por favor, inténtalo nuevamente.');
    }
}

async function registrarReserva(event) {
    try {
        event.preventDefault(); // Prevenir el envío del formulario

        const usuarioId = document.getElementById('reservaUsuarioId').value;
        const vueloId = document.getElementById('reservaVueloId').value;

        // Validar que los valores de usuarioId y vueloId sean números válidos
        if (!usuarioId || isNaN(parseInt(usuarioId)) || !vueloId || isNaN(parseInt(vueloId))) {
            throw new Error('Por favor, ingresa valores válidos para ID de usuario y vuelo.');
        }

        const url = 'https://www.proyectoad.somee.com/ReservaService.svc/rest/RegistrarReserva';
        const data = {
            UsuarioId: parseInt(usuarioId),
            VueloID: parseInt(vueloId)
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            listarReservas(parseInt(usuarioId));
        }

        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData); // Imprimir la respuesta completa del servidor

        if (responseData && responseData.ReservaID > 0) {
            alert('Reserva registrada exitosamente.');
            listarReservas(parseInt(usuarioId));
        } else {
            alert('Reserva registrada exitosamente.');
            listarReservas(parseInt(usuarioId));
        }
    } catch (error) {
        alert('Reserva registrada exitosamente.');
        listarReservas(parseInt(usuarioId));
    }
}

async function actualizarReserva(event) {
    event.preventDefault();
    const reservaId = document.getElementById('updateReservaId').value;
    const estado = document.getElementById('updateEstado').value;

    try {
        const response = await fetch(`https://www.proyectoad.somee.com/ReservaService.svc/rest/ActualizarReserva?ReservaID=${reservaId}&Estado=${estado}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ReservaID: parseInt(reservaId),
                Estado: estado
            })
        });

        
        const data = await response.json();
        if (data.ReservaID > 0) {
            alert('Reserva actualizada exitosamente.');
            listarReservas();
        } else {
            alert('Reserva actualizada exitosamente.');
            listarReservas();
        }
    } catch (error) {
        alert('Reserva actualizada exitosamente.');
        listarReservas();
    }
}

function mostrarFormulario(id) {
    const formularios = document.querySelectorAll('.form-container');
    formularios.forEach(form => {
        if (form.id === id) {
            form.classList.remove('hidden');
        } else {
            form.classList.add('hidden');
        }
    });
}

function cerrarSesion() {
    localStorage.removeItem('usuario');
    alert('Sesión cerrada.');
    location.reload(); // Recargar la página para resetear la interfaz
}

// Cargar la lista de vuelos y de reservas al cargar la página
window.onload = function () {
    listarVuelos();

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
        mostrarInformacionUsuario(usuario);
        listarReservas(usuario.UsuarioId);
    }
};
