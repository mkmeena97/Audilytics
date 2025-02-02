package com.example.audility.controllers;

import com.example.audility.services.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;
    
   

    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/countries")
    public ResponseEntity<List<Map<String, String>>> getCountries() {
        return addressService.getCountries();
    }

    
    @GetMapping("/states/{country}")
    public ResponseEntity<List<Map<String, String>>> getStates(@PathVariable String country) {
        return addressService.getStatesByCountry(country);
    }

    @GetMapping("/cities/{countryCode}/{stateCode}")
    public ResponseEntity<List<String>> getCities(@PathVariable String countryCode, @PathVariable String stateCode) {
        return addressService.getCitiesByState(countryCode,stateCode);
    }
}
