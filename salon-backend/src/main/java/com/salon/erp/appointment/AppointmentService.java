package com.salon.erp.appointment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<AppointmentEntity> findAll() {
        return appointmentRepository.findAll();
    }

    public Optional<AppointmentEntity> findById(String id) {
        return appointmentRepository.findById(id);
    }

    public AppointmentEntity save(AppointmentEntity missionEntity) {
        return appointmentRepository.save(missionEntity);
    }

    public void deleteById(String id) {
        appointmentRepository.deleteById(id);
    }
}
