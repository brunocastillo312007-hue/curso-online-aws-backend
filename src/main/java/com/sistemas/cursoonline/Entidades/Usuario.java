package com.sistemas.cursoonline.Entidades;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "La cédula no puede estar vacía")
    @Pattern(regexp = "^\\d{10}$", message = "La cédula debe contener exactamente 10 dígitos numéricos")
    @Column(unique = true, length = 10)
    private String cedula;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "El correo no puede estar vacío")
    @Email(message = "El formato del correo electrónico no es válido")
    @Column(unique = true)
    private String correo;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasena;

    @NotBlank(message = "El rol no puede estar vacío")
    @Pattern(regexp = "^(ADMIN|ESTUDIANTE|PROFESOR)$", message = "El rol debe ser estrictamente ESTUDIANTE o PROFESOR")
    private String rol;

    // --- Campos de seguridad y control de cuenta ---
    @Enumerated(EnumType.STRING)
    private EstadoUsuario estado = EstadoUsuario.PENDIENTE; // Nace como PENDIENTE

    private boolean verificado = false; // Requiere verificación inicial

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String codigoVerificacion; // Almacena el código temporal de 6 dígitos para el correo

    // Enum para los estados de la cuenta
    public enum EstadoUsuario {
        PENDIENTE, ESPERANDO_ADMIN, APROBADA, RECHAZADA, BLOQUEADA
    }

    // Constructor vacío obligatorio para JPA
    public Usuario() {
    }

    // Constructor con parámetros completo
    public Usuario(String cedula, String nombre, String correo, String contrasena, String rol) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.correo = correo;
        this.contrasena = contrasena;
        this.rol = rol;
        this.estado = EstadoUsuario.PENDIENTE;
        this.verificado = false;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCedula() { 
        return cedula; 
    }
    
    public void setCedula(String cedula) { 
        this.cedula = cedula; 
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public EstadoUsuario getEstado() {
        return estado;
    }

    public void setEstado(EstadoUsuario estado) {
        this.estado = estado;
    }

    public boolean isVerificado() {
        return verificado;
    }

    public void setVerificado(boolean verificado) {
        this.verificado = verificado;
    }

    public String getCodigoVerificacion() {
        return codigoVerificacion;
    }

    public void setCodigoVerificacion(String codigoVerificacion) {
        this.codigoVerificacion = codigoVerificacion;
    }
}