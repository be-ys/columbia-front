package com.almerys.columbia.front.controllers;

import com.almerys.columbia.front.Configuration;
import com.almerys.columbia.front.domain.OssLogin;
import org.json.JSONObject;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.validation.constraints.NotNull;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("login")
public class LoginOSSController {

    private final Configuration configuration;

    public LoginOSSController(Configuration configuration) {
        this.configuration = configuration;
    }

    @PostMapping("")
    public ResponseEntity<Map<String, Object>> auth(@Validated @NotNull @RequestBody OssLogin login){
        if(login.getDomain().equals("local")){
            return login(login.getUsername(), login.getPassword(), login.getDomain()) ;
        }
        return oauth2Login(login.getUsername(), login.getPassword(), login.getDomain());

    }

    private ResponseEntity<Map<String, Object>> login(String username, String password, String domain){
        RestTemplate restTemplate = new RestTemplate();
        JSONObject columbiaDetails;
        String columbia_token;

        HttpHeaders headers;
        LinkedMultiValueMap<String, String> args;


        //3 - Login to ColumbiaAPI and get Bearer
        try {
            headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            args = new LinkedMultiValueMap<>();
            args.add("username", username);
            args.add("password", password);
            args.add("domain", domain);

            ResponseEntity<String> columbia_connect = restTemplate.postForEntity(configuration.getApiUrl() + "login", new HttpEntity<>(args, headers), String.class);
            if (columbia_connect.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.status(columbia_connect.getStatusCode()).build();
            }

            columbia_token = columbia_connect.getHeaders().getFirst("Authorization");
        } catch (HttpClientErrorException e){
            return ResponseEntity.status(e.getStatusCode()).build();
        }

        //4 - Get user informations from Columbia server
        try {
            headers = new HttpHeaders();
            headers.set("Authorization", columbia_token);
            ResponseEntity<String> columbiaAccountDetails = restTemplate.exchange(configuration.getApiUrl() + "users/self", HttpMethod.GET, new HttpEntity<>(headers), String.class);
            if (columbiaAccountDetails.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.status(columbiaAccountDetails.getStatusCode()).build();
            }

            columbiaDetails = new JSONObject(Objects.requireNonNull(columbiaAccountDetails.getBody()));
        } catch (HttpClientErrorException e){
            return ResponseEntity.status(e.getStatusCode()).build();
        }


        //6 - Return data
        Map<String, Object> userinfos =  new HashMap<>();
        userinfos.put("fullName", columbiaDetails.getString("username"));
        userinfos.put("avatar", "/images/avatar.png");
        userinfos.put("role", columbiaDetails.getString("role"));
        userinfos.put("id", columbiaDetails.getString("id"));
        userinfos.put("grantedContexts", columbiaDetails.getJSONArray("grantedContexts").toString());
        userinfos.put("domain", domain);

        return ResponseEntity.ok().header("Authorization", columbia_token).body(userinfos);
    }


    private ResponseEntity<Map<String, Object>> oauth2Login(String username, String password, String domain){
        RestTemplate restTemplate = new RestTemplate();
        JSONObject columbiaDetails;
        JSONObject oauth2details;
        String columbia_token;
        String oauth_token;

        //1 - Login to OAuth2 and get access_token
        HttpHeaders headers = new HttpHeaders();
        LinkedMultiValueMap<String, String> args = new LinkedMultiValueMap<>();

        try{
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            args.add("username", username);
            args.add("password", password);
            args.add("grant_type", "password");
            args.add("client_id", configuration.getOauthClientId());
            args.add("client_secret", configuration.getOauthClientSecret());

            ResponseEntity<String> oauth2connect = restTemplate.postForEntity(configuration.getOauthEndpoint() +"token", new HttpEntity<>(args, headers), String.class);
            if (oauth2connect.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.status(oauth2connect.getStatusCode()).build();
            }


            JSONObject oauth2response = new JSONObject(Objects.requireNonNull(oauth2connect.getBody()));
            oauth_token = oauth2response.getString("access_token");
        } catch (HttpClientErrorException e){
            return ResponseEntity.status(e.getStatusCode()).build();
        }

        //2 - Get user informations from OAuth2 server
        try {
            headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + oauth_token);
            ResponseEntity<String> oauth2accountDetails = restTemplate.exchange(configuration.getOauthEndpoint()+"userinfo", HttpMethod.GET, new HttpEntity<>(headers), String.class);
            if (oauth2accountDetails.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.status(oauth2accountDetails.getStatusCode()).build();
            }

            oauth2details = new JSONObject(Objects.requireNonNull(oauth2accountDetails.getBody()));
        } catch (HttpClientErrorException e){
            return ResponseEntity.status(e.getStatusCode()).build();
        }

        //3 - Login to ColumbiaAPI and get Bearer
        try {
            headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            args = new LinkedMultiValueMap<>();
            args.add("token", "Bearer " + oauth_token);
            args.add("domain", domain);

            ResponseEntity<String> columbia_connect = restTemplate.postForEntity(configuration.getApiUrl() + "login", new HttpEntity<>(args, headers), String.class);
            if (columbia_connect.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.status(columbia_connect.getStatusCode()).build();
            }

            columbia_token = columbia_connect.getHeaders().getFirst("Authorization");
        } catch (HttpClientErrorException e){
            return ResponseEntity.status(e.getStatusCode()).build();
        }

        //4 - Get user informations from Columbia server
        try {
            headers = new HttpHeaders();
            headers.set("Authorization", columbia_token);
            ResponseEntity<String> columbiaAccountDetails = restTemplate.exchange(configuration.getApiUrl() + "users/self", HttpMethod.GET, new HttpEntity<>(headers), String.class);
            if (columbiaAccountDetails.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.status(columbiaAccountDetails.getStatusCode()).build();
            }

            columbiaDetails = new JSONObject(Objects.requireNonNull(columbiaAccountDetails.getBody()));
        } catch (HttpClientErrorException e){
            return ResponseEntity.status(e.getStatusCode()).build();
        }


        //6 - Return data
        Map<String, Object> userinfos =  new HashMap<>();
        userinfos.put("fullName", oauth2details.getString("name"));
        userinfos.put("avatar", "/images/avatar.png");
        userinfos.put("role", columbiaDetails.getString("role"));
        userinfos.put("id", columbiaDetails.getString("id"));
        userinfos.put("grantedContexts", columbiaDetails.getJSONArray("grantedContexts").toString());
        userinfos.put("domain", domain);

        return ResponseEntity.ok().header("Authorization", columbia_token).body(userinfos);

    }


}

