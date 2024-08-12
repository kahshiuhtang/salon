package com.salon.erp.utils;

public class StatusOnlyResponseDTO {
    private String status;
    public StatusOnlyResponseDTO(){

    }
    public StatusOnlyResponseDTO(String status){
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}