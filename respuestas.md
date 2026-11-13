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

