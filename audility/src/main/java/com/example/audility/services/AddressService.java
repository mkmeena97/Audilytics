package com.example.audility.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
public class AddressService {
    private static final String API_BASE_URL = "https://api.countrystatecity.in/v1";

    private final RestTemplate restTemplate;

    @Autowired
    public AddressService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<String> getCountries() {
        String url = API_BASE_URL + "/countries";
        String[] countries = restTemplate.getForObject(url, String[].class);
        return Arrays.asList(countries);
    }

    public List<String> getStates(String countryCode) {
        String url = API_BASE_URL + "/countries/" + countryCode + "/states";
        String[] states = restTemplate.getForObject(url, String[].class);
        return Arrays.asList(states);
    }

    public List<String> getCities(String countryCode, String stateCode) {
        String url = API_BASE_URL + "/countries/" + countryCode + "/states/" + stateCode + "/cities";
        String[] cities = restTemplate.getForObject(url, String[].class);
        return Arrays.asList(cities);
    }
}
