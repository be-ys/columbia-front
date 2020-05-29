package com.almerys.columbia.front;

import com.almerys.columbia.front.domain.Term;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.HashSet;
import java.util.Objects;

@Service
public class Utilities {
    @Autowired
    private Configuration configuration;

    public HashSet<Term> parseTermList(HashSet<Term> terms, String authorization){
        //Récupération des termes connexes existants + création des autres.
        HashSet<Term> parsedTerms = new HashSet<>();
        terms.forEach(e -> {
            //Terme existant ?
            RestTemplate template = new RestTemplate();
            ResponseEntity<String> response = template.getForEntity(configuration.getApiUrl()+"terms/?search="+e.getText(), String.class);
            JSONArray j = new JSONObject(Objects.requireNonNull(response.getBody())).getJSONArray("content");
            if(j.length()==0){
                Term nt = new Term();
                nt.setName(e.getText());

                HttpHeaders headers = createHeaders(authorization);
                HttpEntity<String> entity = createEntity(headers, nt);
                ResponseEntity<String> res = template.postForEntity(configuration.getApiUrl()+"terms", entity, String.class);

                ResponseEntity res2 = template.exchange(Objects.requireNonNull(res.getHeaders().getLocation()).toString(), HttpMethod.GET, new HttpEntity<>(headers), String.class);
                Term te = new Term();
                te.setId(new JSONObject(Objects.requireNonNull(res2.getBody()).toString()).getLong("id"));
                parsedTerms.add(te);

            } else {
                JSONObject obj = j.getJSONObject(0);
                Term t = new Term();
                t.setId(obj.getLong("id"));
                parsedTerms.add(t);
            }
        });

        return parsedTerms;
    }

    public HttpHeaders createHeaders(String authorization){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", authorization);

        return headers;
    }

    public HttpEntity<String> createEntity(HttpHeaders headers, Object nt){
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            return new HttpEntity<>(objectMapper.writeValueAsString(nt), headers);
        } catch (IOException ex) {
            return null;
        }
    }
}
