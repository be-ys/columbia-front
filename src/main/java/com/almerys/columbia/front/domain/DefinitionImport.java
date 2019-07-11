package com.almerys.columbia.front.domain;

import java.util.ArrayList;

public class DefinitionImport {
  Context context;
  Boolean bypass;
  ArrayList<SingleDefinitionImport> definitions;


  public DefinitionImport(){

  }

  public Context getContext() {
    return context;
  }

  public void setContext(Context context) {
    this.context = context;
  }

  public Boolean getBypass() {
    return bypass;
  }

  public void setBypass(Boolean bypass) {
    this.bypass = bypass;
  }

  public ArrayList<SingleDefinitionImport> getDefinitions() {
    return definitions;
  }

  public void setDefinitions(ArrayList<SingleDefinitionImport> definitions) {
    this.definitions = definitions;
  }
}
