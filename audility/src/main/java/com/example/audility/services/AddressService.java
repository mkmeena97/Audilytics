package com.example.audility.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final String GEONAMES_USERNAME = "tabbu09";
    private final RestTemplate restTemplate;

    @Autowired
    public AddressService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<List<Map<String, String>>> getCountries() {
        String url = String.format("http://api.geonames.org/countryInfoJSON?username=%s&style=full", GEONAMES_USERNAME);
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        
        List<Map<String, Object>> geonames = (List<Map<String, Object>>) response.get("geonames");
        

        List<Map<String, String>> countries = geonames.stream()
            .map(geo -> Map.of(
                "countryName", (String) geo.get("countryName"),
                "countryCode", (String) geo.get("countryCode")
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(countries);
    }



    public ResponseEntity<List<Map<String, String>>> getStatesByCountry(String country) {
        String url = String.format(
            "http://api.geonames.org/searchJSON?country=%s&featureClass=A&featureCode=ADM1&username=%s&maxRows=1000",
            country, GEONAMES_USERNAME);
        
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);
        
        List<Map<String, Object>> geonames = (List<Map<String, Object>>) response.get("geonames");

        List<Map<String, String>> states = geonames.stream()
            .map(geo -> Map.of(
                "stateName", (String) geo.get("name"), 
                "stateCode", (String) geo.get("adminCode1"),
                "countryCode",(String) geo.get("countryCode")
            ))
            .collect(Collectors.toList());

        return ResponseEntity.ok(states);
    }


    public ResponseEntity<List<String>> getCitiesByState(String countryCode, String stateCode) {
        String url = String.format(
            "http://api.geonames.org/searchJSON?country=%s&adminCode1=%s&featureClass=P&username=%s&maxRows=1000",
            countryCode, stateCode, GEONAMES_USERNAME);
        
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        List<Map<String, Object>> geonames = (List<Map<String, Object>>) response.get("geonames");

        List<String> cities = geonames.stream()
            .map(geo -> (String) geo.get("name"))
            .collect(Collectors.toList());

        return ResponseEntity.ok(cities);
    }

}
