package com.sistemas.cursoonline.excepciones;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Atrapa cuando faltan campos obligatorios (@Valid)
    // Atrapa errores de validación de JPA/Hibernate (cuando se guarda en la base de datos)
    @ExceptionHandler(jakarta.validation.ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolationException(jakarta.validation.ConstraintViolationException ex) {
        Map<String, String> errores = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            String campo = violation.getPropertyPath().toString();
            String mensaje = violation.getMessage();
            errores.put(campo, mensaje);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
    }

    // 2. Atrapa cuando no se encuentra un ID (RuntimeException lanzada desde los Services)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(respuesta);
    }

    // 3. Atrapa errores de base de datos (Llaves foráneas o duplicados únicos)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDatabaseExceptions(DataIntegrityViolationException ex) {
        Map<String, String> respuesta = new HashMap<>();
        String mensaje = ex.getMostSpecificCause().getMessage();
        String mensajeLower = (mensaje != null) ? mensaje.toLowerCase() : "";

        // 1. Detectamos errores de unicidad / duplicados
        if (mensajeLower.contains("23505") || 
            mensajeLower.contains("unique constraint") || 
            mensajeLower.contains("duplicate key") || 
            mensajeLower.contains("unicidad") || 
            mensajeLower.contains("ya existe la llave")) {
            
            if (mensajeLower.contains("correo")) {
                respuesta.put("correo", "El correo electrónico ya se encuentra registrado en el sistema.");
            } else if (mensajeLower.contains("cedula")) {
                respuesta.put("cedula", "El número de cédula ya se encuentra registrado en el sistema.");
            } else {
                respuesta.put("error", "Ya existe un registro con este dato único en la base de datos.");
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
        } 
        
        else if (mensajeLower.contains("23503") || mensajeLower.contains("llave foránea") || mensajeLower.contains("foreign key")) {
            respuesta.put("error", "El curso o el estudiante al que intenta hacer referencia no existe en el sistema.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(respuesta);
        } 
        
        else {
            respuesta.put("error", "No se puede completar la operación porque tiene elementos asociados o dependencias activas.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(respuesta);
        }
    }
    
    // Atrapa cuando faltan campos obligatorios (@Valid en el @RequestBody)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errores = new HashMap<>();
        
        // Recorre cada error de los campos del objeto
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errores.put(error.getField(), error.getDefaultMessage());
        }
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errores);
    }
}