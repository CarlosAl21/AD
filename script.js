async function iniciarSesion(event) {
    try {
        event.preventDefault(); // Aquí se debe llamar event.preventDefault() para prevenir el envío del formulario
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const response = await fetch('http://www.proyectoad.somee.com/AuthService.svc/rest/IniciarSesion', {
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
            listarReservas();
        } else {
            alert('Inicio de sesión fallido. Verifica tus credenciales.');
        }
    } catch (error) {
        console.error('Error en iniciarSesion:', error);
        alert('Error al iniciar sesión. Por favor, inténtalo nuevamente.');
    }
}

async function registrarUsuario(event) {
    try {
        event.preventDefault(); // Aquí también se debe llamar event.preventDefault() para prevenir el envío del formulario
        const nombre = document.getElementById('registerNombre').value;
        const apellido = document.getElementById('registerApellido').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        const response = await fetch('http://www.proyectoad.somee.com/UsuarioService.svc/rest/RegistrarUsuario', {
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
            alert(`Usuario registrado exitosamente. Bienvenido, ${nombre} ${apellido}!`);
        } else {
            alert('Error al registrar usuario. Por favor, inténtalo nuevamente.');
        }
    } catch (error) {
        console.error('Error en registrarUsuario:', error);
        alert('Error al registrar usuario. Por favor, inténtalo nuevamente.');
    }
}

async function listarVuelos() {
    try {
        const response = await fetch('http://www.proyectoad.somee.com/VueloService.svc/rest/ListarVuelos', {
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

async function buscarVuelos(origen, destino) {
    try {
        const response = await fetch('http://www.proyectoad.somee.com/VueloService.svc/rest/BuscarVuelos', {
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

async function listarReservas() {
    try {
        const response = await fetch('http://www.proyectoad.somee.com/ReservaService.svc/rest/ListarReservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([])
        });

        const data = await response.json();
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
        event.preventDefault(); // Aquí se debe llamar event.preventDefault() para prevenir el envío del formulario
        const usuarioId = document.getElementById('reservaUsuarioId').value;
        const vueloId = document.getElementById('reservaVueloId').value;

        const response = await fetch('http://www.proyectoad.somee.com/ReservaService.svc/rest/RegistrarReserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                UsuarioId: parseInt(usuarioId),
                VueloID: parseInt(vueloId)
            })
        });

        const data = await response.json();
        if (data.ReservaID > 0) {
            alert('Reserva registrada exitosamente.');
            listarReservas();
        } else {
            alert('Error al registrar reserva. Por favor, inténtalo nuevamente.');
        }
    } catch (error) {
        console.error('Error en registrarReserva:', error);
        alert('Error al registrar reserva. Por favor, inténtalo nuevamente.');
    }
}

async function actualizarReserva(event) {
    try {
        event.preventDefault(); // Aquí se debe llamar event.preventDefault() para prevenir el envío del formulario
        const reservaId = document.getElementById('updateReservaId').value;
        const estado = document.getElementById('updateEstado').value;

        const response = await fetch(`http://www.proyectoad.somee.com/ReservaService.svc/rest/ActualizarReserva?ReservaID=${reservaId}&Estado=${estado}`, {
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
            alert('Error al actualizar reserva. Por favor, inténtalo nuevamente.');
        }
    } catch (error) {
        console.error('Error en actualizarReserva:', error);
        alert('Error al actualizar reserva. Por favor, inténtalo nuevamente.');
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

// Cargar la lista de vuelos y de reservas al cargar la página
window.onload = function () {
    listarVuelos();
    listarReservas();
};
