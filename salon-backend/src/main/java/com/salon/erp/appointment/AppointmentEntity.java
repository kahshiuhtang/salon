package com.salon.erp.appointment;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "appointment")
public class AppointmentEntity {
    @Id
    private String id;
    private String customerId;
    private Date date;
    private String employeeId;
    private String preAppointmentDetails;
    private String postAppointmentDetails;
    private float cost;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }
    public String getPreAppointmentDetails() {
        return preAppointmentDetails;
    }

    public void setPreAppointmentDetails(String preAppointmentDetails) {
        this.preAppointmentDetails = preAppointmentDetails;
    }
    public String getPostAppointmentDetails() {
        return postAppointmentDetails;
    }

    public void setPostAppointmentDetails(String postAppointmentDetails) {
        this.postAppointmentDetails = postAppointmentDetails;
    }

    public float getCost() {
        return cost;
    }

    public void setCost(float cost) {
        this.cost = cost;
    }
}
