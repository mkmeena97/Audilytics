package com.example.audility.controllers;

import com.example.audility.services.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;

    @Autowired
    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/countries")
    public List<String> getCountries() {
        return addressService.getCountries();
    }

    @GetMapping("/states")
    public List<String> getStates(@RequestParam String countryCode) {
        return addressService.getStates(countryCode);
    }

    @GetMapping("/cities")
    public List<String> getCities(@RequestParam String countryCode, @RequestParam String stateCode) {
        return addressService.getCities(countryCode, stateCode);
    }
}
