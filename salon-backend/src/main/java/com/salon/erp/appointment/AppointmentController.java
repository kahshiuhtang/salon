package com.salon.erp.appointment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<AppointmentEntity> getAllAppointments() {
        return appointmentService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentEntity> getAppointmentById(@PathVariable String id) {
        return appointmentService.findById(id)
                .map(appointmentEntity -> new ResponseEntity<>(appointmentEntity, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public AppointmentEntity createAppointment(@RequestBody AppointmentEntity appointmentEntity) {
        return appointmentService.save(appointmentEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentEntity> updateAppointment(@PathVariable String id, @RequestBody AppointmentEntity appointmentEntity) {
        return appointmentService.findById(id)
                .map(existingAppointment -> {
                    existingAppointment.setEmployeeId(appointmentEntity.getEmployeeId());
                    existingAppointment.setCustomerId(appointmentEntity.getCustomerId());
                    existingAppointment.setDate(appointmentEntity.getDate());
                    existingAppointment.setPostAppointmentDetails(appointmentEntity.getPostAppointmentDetails());
                    return new ResponseEntity<>(appointmentService.save(existingAppointment), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        if (appointmentService.findById(id).isPresent()) {
            appointmentService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
