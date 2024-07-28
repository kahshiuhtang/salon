package com.salon.erp.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @GetMapping
    public List<EmployeeEntity> getAllEmployees() {
        return employeeService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeEntity> getEmployeeById(@PathVariable String id) {
        return employeeService.findById(id)
                .map(employeeEntity -> new ResponseEntity<>(employeeEntity, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public EmployeeEntity createEmployee(@RequestBody EmployeeEntity employeeEntity) {
        return employeeService.save(employeeEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeEntity> updateEmployee(@PathVariable String id, @RequestBody EmployeeEntity employeeEntity) {
        return employeeService.findById(id)
                .map(existingEmployee -> {
                    existingEmployee.setFirstName(employeeEntity.getFirstName());
                    existingEmployee.setLastName(employeeEntity.getLastName());
                    existingEmployee.setNotes(employeeEntity.getNotes());
                    existingEmployee.setServices(employeeEntity.getServices());
                    return new ResponseEntity<>(employeeService.save(existingEmployee), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable String id) {
        if (employeeService.findById(id).isPresent()) {
            employeeService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
