package com.almerys.columbia.front.controllers;

import com.almerys.columbia.front.Configuration;
import com.almerys.columbia.front.Utilities;
import com.almerys.columbia.front.domain.Definition;
import com.almerys.columbia.front.domain.DefinitionUpdater;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotNull;
import java.util.HashSet;

@RestController
@RequestMapping("definition")
public class CreateDefinitionController {

    private final Configuration configuration;
    private final Utilities utilities;

    public CreateDefinitionController(Configuration configuration, Utilities utilities) {
        this.configuration = configuration;
        this.utilities = utilities;
    }

    @RequestMapping( method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<Void> createDefinition(HttpServletRequest request, @NotNull @RequestHeader("Authorization") String authorization, @RequestBody @NotNull @Validated Definition data){

        DefinitionUpdater toSend = new DefinitionUpdater();
        toSend.setDefinition(data.getDefinition());
        toSend.setGdpr(data.getGdpr());
        toSend.setTerm(data.getTerm());

        HashSet<String> bib =  new HashSet<>();
        data.getBibliography().forEach(e -> bib.add(e.getText()));

        HashSet<String> sources =  new HashSet<>();
        data.getSources().forEach(e -> sources.add(e.getText()));

        Long contextId = data.getContext().getId();
        Long termId = data.getTerm().getId();

        toSend.setSynonymsTermList(utilities.parseTermList(data.getSynonymsTermList(), authorization));
        toSend.setAntonymsTermList(utilities.parseTermList(data.getAntonymsTermList(), authorization));
        toSend.setRelatedTermList(utilities.parseTermList(data.getRelatedTermList(), authorization));
        toSend.setSources(sources);
        toSend.setBibliography(bib);

        //Envoi serveur.
        HttpHeaders headers = utilities.createHeaders(authorization);
        HttpEntity<String> entity = utilities.createEntity(headers, toSend);

        RestTemplate template = new RestTemplate();
        if ((request.getMethod().equals("POST"))) {
            template.postForEntity(configuration.getApiUrl() + "contexts/{c}/terms", entity, Object.class, contextId);
        } else {
            template.put(configuration.getApiUrl() + "contexts/{c}/terms/{t}", entity, contextId, termId);
        }

        return ResponseEntity.ok().build();
    }
}