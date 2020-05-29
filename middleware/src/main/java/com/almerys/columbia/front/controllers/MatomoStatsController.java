package com.almerys.columbia.front.controllers;

import com.almerys.columbia.front.Configuration;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;

@RestController
@RequestMapping("matomoStats")
public class MatomoStatsController {

   private final Configuration configuration;

    public MatomoStatsController(Configuration configuration) {
        this.configuration = configuration;
    }

    @GetMapping()
    public ResponseEntity<String> getMatomoStats(){
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(configuration.getMatomoUrl()+"index.php?module=API&method=Actions.get&idSite="+configuration.getMatomoIdSite()+"&period=range&date=1999-01-01,today&format=JSON&token_auth="+configuration.getMatomoToken(), String.class);
        return ResponseEntity.ok(new JSONObject(Objects.requireNonNull(response.getBody())).toString());
    }
}
