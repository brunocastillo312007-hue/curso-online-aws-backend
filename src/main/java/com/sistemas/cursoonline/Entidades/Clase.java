package com.sistemas.cursoonline.Entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "clases")
public class Clase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título de la clase es obligatorio")
    @Size(min = 10, message = "El título debe tener al menos 10 caracteres")
    private String titulo;

    @NotBlank(message = "La URL del video es obligatoria")
    private String urlVideo;

    @NotNull(message = "El número de orden es obligatorio")
    private Integer orden;

    // Relación: Muchas clases pertenecen a un curso
    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    // Constructor vacío (obligatorio para JPA)
    public Clase() {
    }

    // Constructor con parámetros
    public Clase(String titulo, String urlVideo, Integer orden, Curso curso) {
        this.titulo = titulo;
        this.urlVideo = urlVideo;
        this.orden = orden;
        this.curso = curso;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getUrlVideo() {
        return urlVideo;
    }

    public void setUrlVideo(String urlVideo) {
        this.urlVideo = urlVideo;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    public Curso getCurso() {
        return curso;
    }

    public void setCurso(Curso curso) {
        this.curso = curso;
    }
}