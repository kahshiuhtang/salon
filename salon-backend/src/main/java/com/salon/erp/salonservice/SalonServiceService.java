package com.salon.erp.salonservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SalonServiceService {

    @Autowired
    private SalonServiceRepository salonServiceRepository;

    public List<SalonServiceEntity> findAll() {
        return salonServiceRepository.findAll();
    }

    public Optional<SalonServiceEntity> findById(String id) {
        return salonServiceRepository.findById(id);
    }

    public SalonServiceEntity save(SalonServiceEntity salonServiceEntity) {
        return salonServiceRepository.save(salonServiceEntity);
    }

    public void deleteById(String id) {
        salonServiceRepository.deleteById(id);
    }
}
