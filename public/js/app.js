import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', ()=>{

    const skills = document.querySelector('.lista-conocimientos');

    //limpiar alertas
    const alertas = document.querySelector('.alertas');

    if(alertas){
        limpiarAlertas(alertas);
    }

    if(skills){
        skills.addEventListener('click', agregarSkills);

        //una vez que estamos en editar llamar la funcion
        skillsSeleccionados();
        
    }
    
    const vacantesListado = document.querySelector('.panel-administracion');

    if(vacantesListado){
        vacantesListado.addEventListener('click', accionesListado);
    }

});

const skills = new Set();

const agregarSkills = (e) => {
    if(e.target.tagName == 'LI'){
        if(e.target.classList.contains('activo')){
            //quitar del set y quitar clase
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else{
            //agregar al set y agregar clase
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }
    // const skillsArray = [...skills];
    document.querySelector('#skills').value = [...skills];

}

const skillsSeleccionados = () => {

    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));
    seleccionadas.forEach(seleccionada=>{
        skills.add(seleccionada.textContent);
    })
    //inyectarlo en el input hidden
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;

}

const limpiarAlertas = (alertas) => {
    
    const interval = setInterval(()=>{
        if(alertas.firstElementChild){
            alertas.removeChild(alertas.children[0]);
        }else{
            alertas.remove();
            clearInterval(interval);
        }
       
    },1500)


}

///Eliminar vacacntes
const accionesListado = (e) => {
    e.preventDefault();
    if(e.target.dataset.eliminar){
        //Eliminar por medio de axios
        Swal.fire({
            title: 'Confirmar Eliminación?',
            text: "Una vez eliminado no se podra recuperar.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                //Enviar peticion con axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
                axios.delete(url)
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        Swal.fire(
                            'Eliminado!',
                            'La vacante ha sido eliminada.',
                            'success'
                          )
                    }
                    //TODO ELIMINAR DEL DOM
                    e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                }
                .catch(()=>{
                    Swal.fire({
                        title: 'Error!',
                        text: 'No se pudo eliminar la vacante.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                })
                )
              
            }
            
          })

    }else if(e.targer.tagName === 'A'){
        window.location.href = e.targert.href;
    }
};