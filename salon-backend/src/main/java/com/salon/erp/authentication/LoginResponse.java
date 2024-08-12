package com.salon.erp.authentication;

public class LoginResponse {

    private String token;
    private long expiresIn;
    private String status;

    public LoginResponse(){

    }
    public LoginResponse(String status){
        this.status = status;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getToken() {
        return token;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}