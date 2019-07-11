package com.almerys.columbia.front;

import com.almerys.columbia.front.domain.Definition;
import com.almerys.columbia.front.domain.DefinitionImport;
import com.almerys.columbia.front.domain.DefinitionUpdater;
import com.almerys.columbia.front.domain.Term;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Objects;

@org.springframework.web.bind.annotation.RestController
public class RestController {
  @Value("${app.api.url}")
  protected String apiUrl;

  @Value("${app.front.url}")
  protected String frontUrl;

  @Value("${app.oauth2.url}")
  protected String oauth2Url;

  @Value("${app.matomo.url}")
  protected String matomoUrl;

  @Value("${app.matomo.idSite}")
  protected Long matomoId;

  @Value("${app.matomo.token}")
  protected String matomoToken;


  @GetMapping("/matomoStats")
  public ResponseEntity<String> getMatomoStats(){
    RestTemplate restTemplate = new RestTemplate();
    ResponseEntity<String> response = restTemplate.getForEntity(matomoUrl+"index.php?module=API&method=Actions.get&idSite="+matomoId+"&period=range&date=1999-01-01,today&format=JSON&token_auth="+matomoToken, String.class);
    return ResponseEntity.ok(new JSONObject(Objects.requireNonNull(response.getBody())).toString());
  }

  @PostMapping("/csvimport")
  public ResponseEntity<String> importCSV(@NotNull @RequestHeader("Authorization") String authorization, @RequestBody @NotNull @Validated DefinitionImport data){
    //1 - Création de toute les définitions aux formats standardisés et les termes aussi.
    HashSet<DefinitionUpdater> defs = new HashSet<>();
    data.getDefinitions().forEach(e -> {
      Term newTerm=new Term();
      newTerm.setName(e.getTerm().getText());

      //On vérifie si le terme existe, on le créé sinon; puis on stocke son ID.
      RestTemplate template = new RestTemplate();
      ResponseEntity<String> response = template.getForEntity(apiUrl+"terms/?search="+e.getTerm().getText(), String.class);
      JSONArray terms = new JSONObject(Objects.requireNonNull(response.getBody())).getJSONArray("content");
      if(terms.length()==0){
        newTerm.setAbbreviations(e.getAbbr());

        //Création requise.
        HttpHeaders headers = createHeaders(authorization);
        HttpEntity<String> entity = createEntity(headers, newTerm);
        response = template.postForEntity(apiUrl+"terms", entity, String.class);

        //Enregistrement terme
        response = template.getForEntity(Objects.requireNonNull(response.getHeaders().getLocation()).toString(), String.class);
        JSONObject obj = new JSONObject(Objects.requireNonNull(response.getBody()));
        newTerm.setId(obj.getLong("id"));
        newTerm.setName(obj.getString("name"));
      }
      else {
        //Enregistrement terme
        newTerm.setId(terms.getJSONObject(0).getLong("id"));
        newTerm.setName(terms.getJSONObject(0).getString("name"));
      }

      //Construction de la définition
      DefinitionUpdater def = new DefinitionUpdater();
      def.setTerm(newTerm);
      def.setDefinition(e.getDef());
      def.setGdpr(e.getRgpd());

      //Passage des sources en liste de string
      HashSet<String> sources= new HashSet<>();
      e.getSou().forEach(f -> sources.add(f.getText()));
      def.setSources(sources);

      //Idem pour la bibliographie
      HashSet<String> bibliography= new HashSet<>();
      e.getBib().forEach(f -> bibliography.add(f.getText()));
      def.setBibliography(bibliography);

      def.setSynonymsTermList(parseTermList(e.getSyn(), authorization));
      def.setAntonymsTermList(parseTermList(e.getAnt(), authorization));
      def.setRelatedTermList(parseTermList(e.getRel(), authorization));

      //Sauvegarde dans defs
      defs.add(def);
    });

    JSONArray results= new JSONArray();
    //Traitement selon override ou pas, stockage de tout les résultats dans un JSON
    if(data.getBypass()==null || !data.getBypass()){
      //Pas de bypass, on POST tout et osef des erreurs
      defs.forEach(e -> {
        try{
          RestTemplate senderTemplate = new RestTemplate();

          HttpHeaders httpHeaders = createHeaders(authorization);
          HttpEntity<String> entity = createEntity(httpHeaders, e);

          ResponseEntity<String> res = senderTemplate.postForEntity(apiUrl+"contexts/{c}/terms", entity, String.class, data.getContext().getId());

          JSONObject o = new JSONObject();
          o.put("term", e.getTerm().getName());
          o.put("location", Objects.requireNonNull(res.getHeaders().getLocation()).toString());
          o.put("status", "created");
          results.put(o);
        } catch(Exception exception){
          JSONObject o = new JSONObject();
          o.put("term", e.getTerm().getName());
          o.put("status", "error");
          o.put("cause", exception.getMessage());
          results.put(o);
        }
      });

    } else {
      //Bypass, on POST, si erreur on PUT.
      //Pas de bypass, on POST tout et osef des erreurs
      defs.forEach(e -> {
        try{
          RestTemplate senderTemplate = new RestTemplate();
          HttpHeaders httpHeaders = createHeaders(authorization);
          HttpEntity<String> entity = createEntity(httpHeaders, e);


          ResponseEntity<String> res = senderTemplate.postForEntity(apiUrl+"contexts/{c}/terms", entity, String.class, data.getContext().getId());

          JSONObject o = new JSONObject();
          o.put("term", e.getTerm().getName());
          o.put("location", Objects.requireNonNull(res.getHeaders().getLocation()).toString());
          o.put("status", "created");
          results.put(o);
        } catch(Exception exception){
          try{
            RestTemplate senderTemplate = new RestTemplate();
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentType(MediaType.APPLICATION_JSON);
            httpHeaders.set("Authorization", authorization);
            ObjectMapper objectMapper = new ObjectMapper();
            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(e), httpHeaders);
            senderTemplate.put(apiUrl+"contexts/{c}/terms/{t}", entity, data.getContext().getId(), e.getTerm().getId());

            JSONObject o = new JSONObject();
            o.put("term", e.getTerm().getName());
            o.put("location", apiUrl+"contexts/"+data.getContext().getId()+"/terms/"+e.getTerm().getId());
            o.put("status", "updated");
            results.put(o);
          } catch(Exception exp){
            JSONObject o = new JSONObject();
            o.put("term", e.getTerm().getName());
            o.put("status", "error");
            o.put("cause", exp.getMessage());
            results.put(o);
          }
        }
      });
    }

    //Retour JSON
    return ResponseEntity.ok(results.toString());
  }






  @PostMapping("/createDefinition")
  public ResponseEntity<Void> createDefinition(@NotNull @RequestHeader("Authorization") String authorization, @RequestBody @NotNull @Validated Definition data){
    DefinitionUpdater toSend = new DefinitionUpdater();
    toSend.setDefinition(data.getDefinition());
    toSend.setGdpr(data.getGdpr());
    toSend.setTerm(data.getTerm());

    HashSet<String> bib =  new HashSet<>();
    data.getBibliography().forEach(e -> bib.add(e.getText()));

    HashSet<String> sources =  new HashSet<>();
    data.getSources().forEach(e -> sources.add(e.getText()));

    Long contextId = data.getContext().getId();

    toSend.setSynonymsTermList(parseTermList(data.getSynonymsTermList(), authorization));
    toSend.setAntonymsTermList(parseTermList(data.getAntonymsTermList(), authorization));
    toSend.setRelatedTermList(parseTermList(data.getRelatedTermList(), authorization));
    toSend.setSources(sources);
    toSend.setBibliography(bib);

    //Envoi serveur.
    HttpHeaders headers = createHeaders(authorization);
    HttpEntity<String> entity = createEntity(headers, toSend);

    RestTemplate template = new RestTemplate();
    template.postForEntity(apiUrl+"contexts/{c}/terms", entity, Object.class, contextId);

    return ResponseEntity.ok().build();
  }




  @PutMapping("/updateDefinition")
  public ResponseEntity<Void> updateDefinition(@NotNull @RequestHeader("Authorization") String authorization, @RequestBody @NotNull @Validated Definition data){
    DefinitionUpdater toSend = new DefinitionUpdater();
    toSend.setDefinition(data.getDefinition());
    toSend.setGdpr(data.getGdpr());

    HashSet<String> bib =  new HashSet<>();
    data.getBibliography().forEach(e -> bib.add(e.getText()));

    HashSet<String> sources =  new HashSet<>();
    data.getSources().forEach(e -> sources.add(e.getText()));

    Long contextId = data.getContext().getId();
    Long termId = data.getTerm().getId();

    toSend.setSynonymsTermList(parseTermList(data.getSynonymsTermList(), authorization));
    toSend.setAntonymsTermList(parseTermList(data.getAntonymsTermList(), authorization));
    toSend.setRelatedTermList(parseTermList(data.getRelatedTermList(), authorization));
    toSend.setSources(sources);
    toSend.setBibliography(bib);

    //Envoi serveur.
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", authorization);

    ObjectMapper objectMapper = new ObjectMapper();

    HttpEntity<String> entity = null;
    try {
      entity = new HttpEntity<>(objectMapper.writeValueAsString(toSend), headers);
    } catch (IOException ex) {
      ex.printStackTrace();
    }

    RestTemplate template = new RestTemplate();
    template.put(apiUrl+"contexts/{c}/terms/{t}", entity, contextId, termId);

    return ResponseEntity.ok().build();
  }

  @PostMapping("/auth")
  public ResponseEntity<Map<String, Object>> auth(@RequestParam("username") String username, @RequestParam("password") String password, @RequestParam("domain") String domain){
    if(domain.equals("local")){
      return login(username, password, domain) ;
    }
    return oauth2Login(username, password, domain);

  }

  private ResponseEntity<Map<String, Object>> login(String username, String password, String domain){
    RestTemplate restTemplate = new RestTemplate();
    JSONObject columbiaDetails;
    String columbia_token;

    HttpHeaders headers = new HttpHeaders();
    LinkedMultiValueMap<String, String> args = new LinkedMultiValueMap<>();


    //3 - Login to ColumbiaAPI and get Bearer
    try {
      headers = new HttpHeaders();
      headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

      args = new LinkedMultiValueMap<>();
      args.add("username", username);
      args.add("password", password);
      args.add("domain", domain);

      ResponseEntity columbia_connect = restTemplate.postForEntity(apiUrl + "login", new HttpEntity<>(args, headers), String.class);
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
      ResponseEntity columbiaAccountDetails = restTemplate.exchange(apiUrl + "users/self", HttpMethod.GET, new HttpEntity<>(headers), String.class);
      if (columbiaAccountDetails.getStatusCode() != HttpStatus.OK) {
        return ResponseEntity.status(columbiaAccountDetails.getStatusCode()).build();
      }

      columbiaDetails = new JSONObject(Objects.requireNonNull(columbiaAccountDetails.getBody()).toString());
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
      args.add("client_id", "columbia");

      ResponseEntity oauth2connect = restTemplate.postForEntity(oauth2Url+"token", new HttpEntity<>(args, headers), String.class);
      if (oauth2connect.getStatusCode() != HttpStatus.OK) {
        return ResponseEntity.status(oauth2connect.getStatusCode()).build();
      }

      JSONObject oauth2response = new JSONObject(Objects.requireNonNull(oauth2connect.getBody()).toString());
      oauth_token = oauth2response.getString("access_token");
    } catch (HttpClientErrorException e){
      return ResponseEntity.status(e.getStatusCode()).build();
    }

    //2 - Get user informations from OAuth2 server
    try {
      headers = new HttpHeaders();
      headers.set("Authorization", "Bearer " + oauth_token);
      ResponseEntity oauth2accountDetails = restTemplate.exchange(oauth2Url+"userinfo", HttpMethod.GET, new HttpEntity<>(headers), String.class);
      if (oauth2accountDetails.getStatusCode() != HttpStatus.OK) {
        return ResponseEntity.status(oauth2accountDetails.getStatusCode()).build();
      }

      oauth2details = new JSONObject(Objects.requireNonNull(oauth2accountDetails.getBody()).toString());
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

      ResponseEntity columbia_connect = restTemplate.postForEntity(apiUrl + "login", new HttpEntity<>(args, headers), String.class);
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
      ResponseEntity columbiaAccountDetails = restTemplate.exchange(apiUrl + "users/self", HttpMethod.GET, new HttpEntity<>(headers), String.class);
      if (columbiaAccountDetails.getStatusCode() != HttpStatus.OK) {
        return ResponseEntity.status(columbiaAccountDetails.getStatusCode()).build();
      }

      columbiaDetails = new JSONObject(Objects.requireNonNull(columbiaAccountDetails.getBody()).toString());
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


  //Méthodes privées

  private HashSet<Term> parseTermList(HashSet<Term> terms, String authorization){
    //Récupération des termes connexes existants + création des autres.
    HashSet<Term> parsedTerms = new HashSet<>();
    terms.forEach(e -> {
      //Terme existant ?
      RestTemplate template = new RestTemplate();
      ResponseEntity<String> response = template.getForEntity(apiUrl+"terms/?search="+e.getText(), String.class);
      JSONArray j = new JSONObject(Objects.requireNonNull(response.getBody())).getJSONArray("content");
      if(j.length()==0){
        Term nt = new Term();
        nt.setName(e.getText());

        HttpHeaders headers = createHeaders(authorization);
        HttpEntity<String> entity = createEntity(headers, nt);
        ResponseEntity<String> res = template.postForEntity(apiUrl+"terms", entity, String.class);

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

  private HttpHeaders createHeaders(String authorization){
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.set("Authorization", authorization);

    return headers;
  }

  private HttpEntity<String> createEntity(HttpHeaders headers, Object nt){
    ObjectMapper objectMapper = new ObjectMapper();

    try {
      return new HttpEntity<>(objectMapper.writeValueAsString(nt), headers);
    } catch (IOException ex) {
      return null;
    }
  }
}