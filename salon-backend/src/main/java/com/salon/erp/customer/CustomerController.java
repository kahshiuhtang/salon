package com.salon.erp.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @GetMapping
    public List<CustomerEntity> getAllCustomers() {
        return customerService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerEntity> getCustomerById(@PathVariable String id) {
        return customerService.findById(id)
                .map(customerEntity -> new ResponseEntity<>(customerEntity, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public CustomerEntity createCustomer(@RequestBody CustomerEntity customerEntity) {
        return customerService.save(customerEntity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerEntity> updateCustomer(@PathVariable String id, @RequestBody CustomerEntity customerEntity) {
        return customerService.findById(id)
                .map(existingCustomer -> {
                    existingCustomer.setFirstName(customerEntity.getFirstName());
                    existingCustomer.setLastName(customerEntity.getFirstName());
                    existingCustomer.setNotes(customerEntity.getNotes());
                    existingCustomer.setEmail(customerEntity.getEmail());
                    existingCustomer.setPhoneNumber(customerEntity.getPhoneNumber());
                    return new ResponseEntity<>(customerService.save(existingCustomer), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable String id) {
        if (customerService.findById(id).isPresent()) {
            customerService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
