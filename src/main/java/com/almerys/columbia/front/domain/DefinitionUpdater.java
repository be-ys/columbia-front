package com.almerys.columbia.front.domain;

import java.util.HashSet;

public class DefinitionUpdater {
  Context context;
  Term term;
  String definition;
  HashSet<Term> synonymsTermList;
  HashSet<Term> antonymsTermList;
  HashSet<Term> relatedTermList;
  Boolean gdpr;
  HashSet<String> bibliography;
  HashSet<String> sources;

  Object htmlbib;
  Object htmlsources;

  public DefinitionUpdater(){

  }

  public Context getContext() {
    return context;
  }

  public void setContext(Context context) {
    this.context = context;
  }

  public Term getTerm() {
    return term;
  }

  public void setTerm(Term term) {
    this.term = term;
  }

  public String getDefinition() {
    return definition;
  }

  public void setDefinition(String definition) {
    this.definition = definition;
  }

  public HashSet<Term> getSynonymsTermList() {
    return synonymsTermList;
  }

  public void setSynonymsTermList(HashSet<Term> synonymsTermList) {
    this.synonymsTermList = synonymsTermList;
  }

  public HashSet<Term> getAntonymsTermList() {
    return antonymsTermList;
  }

  public void setAntonymsTermList(HashSet<Term> antonymsTermList) {
    this.antonymsTermList = antonymsTermList;
  }

  public HashSet<Term> getRelatedTermList() {
    return relatedTermList;
  }

  public void setRelatedTermList(HashSet<Term> relatedTermList) {
    this.relatedTermList = relatedTermList;
  }

  public Boolean getGdpr() {
    return gdpr;
  }

  public void setGdpr(Boolean gdpr) {
    this.gdpr = gdpr;
  }

  public HashSet<String> getBibliography() {
    return bibliography;
  }

  public void setBibliography(HashSet<String> bibliography) {
    this.bibliography = bibliography;
  }

  public HashSet<String> getSources() {
    return sources;
  }

  public void setSources(HashSet<String> sources) {
    this.sources = sources;
  }
}
