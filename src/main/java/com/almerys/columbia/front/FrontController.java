package com.almerys.columbia.front;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontController {

  @Value("${app.api.url}")
  protected String apiUrl;

  @Value("${app.front.url}")
  protected String frontUrl;

  @Value("${app.matomo.url}")
  protected String matomoUrl;

  @Value("${app.matomo.idSite}")
  protected Long matomoId;



  @GetMapping("/")
  public String index(Model model){
    model.addAttribute("fronturl", frontUrl);
    model.addAttribute("matomoUrl", matomoUrl);
    model.addAttribute("matomoId", matomoId);
    return "index";
  }

}
