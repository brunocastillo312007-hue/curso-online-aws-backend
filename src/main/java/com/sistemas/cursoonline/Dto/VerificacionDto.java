package com.sistemas.cursoonline.Dto;

public class VerificacionDto {

    private String correo;
    private String codigo;

    // Constructor vacío
    public VerificacionDto() {
    }

    // Getters y Setters
    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
}