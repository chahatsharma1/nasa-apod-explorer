package com.nasa.apod.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class ApodResponse implements Serializable {
    private String date;
    private String explanation;
    private String hdurl;
    
    @JsonProperty("media_type")
    private String mediaType;
    
    @JsonProperty("service_version")
    private String serviceVersion;
    
    private String title;
    private String url;
    private String copyright;
}
