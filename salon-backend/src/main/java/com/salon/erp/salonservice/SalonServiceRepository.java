package com.salon.erp.salonservice;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SalonServiceRepository extends MongoRepository<SalonServiceEntity, String> {
}
