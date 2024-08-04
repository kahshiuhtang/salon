package com.salon.erp.salonservice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/salonservice")
public class SalonServiceController {
    @Autowired
    private SalonServiceService salonServiceService;

    @GetMapping
    public List<SalonServiceEntity> getAllSalonServices() {
        return salonServiceService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalonServiceEntity> getSalonServiceById(@PathVariable String id) {
        return salonServiceService.findById(id)
                .map(employeeEntity -> new ResponseEntity<>(employeeEntity, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public SalonServiceEntity createSalonService(@RequestBody SalonServiceEntity salonServiceEntity) {
        return salonServiceService.save(salonServiceEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalonServiceEntity> updateSalonService(@PathVariable String id, @RequestBody SalonServiceEntity salonServiceEntity) {
        return salonServiceService.findById(id)
                .map(existingSalonService -> {
                    existingSalonService.setServiceName(salonServiceEntity.getServiceName());
                    existingSalonService.setServiceDescription(salonServiceEntity.getServiceDescription());
                    existingSalonService.setTimeToComplete(salonServiceEntity.getTimeToComplete());
                    existingSalonService.setCost(salonServiceEntity.getCost());
                    return new ResponseEntity<>(salonServiceService.save(existingSalonService), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalonService(@PathVariable String id) {
        if (salonServiceService.findById(id).isPresent()) {
            salonServiceService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
