# Respuestas

## Pregunta 0

********api-rastro (main)
$ git push

 ! [remote rejected] main -> main (push declined due to repository rule violations)
error: failed to push some refs to 'https://github.com/laumarva99/api-rastro.git'


GitHub no deja subir cambios a main sin una pull request y pasar los checks


## Pregunta 1

{"statusCode":500,"message":"Internal server error"}

Si PostgreSQL está apagado, el cliente recibe un error 500 genérico, mientras que el error completo aparece en la terminal de NestJS. Así no se muestran detalles internos del servidor al usuario



## Pregunta 2

Con la versión mala aparecen las 7 clases porque el texto puede modificar la consulta y mostrar todos los resultados. Sin embargo, con $1, PostgreSQL no encuentra ninguna clase porque utiliza el valor como texto


## Pregunta 3

Antes de guardar, comprobamos que el trainerId sea válido. Si no existe, devolvemos un error 400 porque el problema está en los datos que ha enviado el cliente, no en el servidor


## Pregunta 4

Porque la petición es correcta, pero no se puede eliminar la clase porque todavía tiene reservas; 400 es para peticiones incorrectas


## Pregunta 5

Tiene el ID de Ana y las fechas de creación y caducidad. No incluimos el rol porque puede cambiar, así que lo consultamos en la base de datos en cada petición para tenerlo actualizado

{
  "sub": 1,
  "iat": 1794843938,
  "exp": 1794847538
}


## Pregunta 6

Porque el token solo contiene el ID del usuario. Cada vez que hace una petición, se comprueba en la base de datos qué permisos tiene en ese momento y se actualiza automáticamente sin tener que iniciar sesión otra vez