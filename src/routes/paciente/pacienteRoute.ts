const Paciente = require('../../controllers/paciente/pacienteController.ts');

module.exports = (router) => {
    router.post('/crearPaciente', Paciente.createPaciente);
    router.get('/pacientes', Paciente.pacientes);
    router.put('/cambioDatos/:id', Paciente.cambioDatos);
    router.get('/paciente/:id', Paciente.paciente);
    router.get('/pacientepag/:page/:num', Paciente.PaginacionPaciente);
    router.post('/buscarPaciente', Paciente.buscarPaciente);


}