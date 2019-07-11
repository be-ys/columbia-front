package com.almerys.columbia.front.domain;

import java.util.HashSet;

public class Definition {
  Context context;
  Term term;
  String definition;
  HashSet<Term> synonymsTermList;
  HashSet<Term> antonymsTermList;
  HashSet<Term> relatedTermList;
  Boolean gdpr;
  HashSet<Sources> bibliography;
  HashSet<Sources> sources;

  Object htmlbib;
  Object htmlsources;

  public Definition(){

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

  public HashSet<Sources> getBibliography() {
    return bibliography;
  }

  public void setBibliography(HashSet<Sources> bibliography) {
    this.bibliography = bibliography;
  }

  public HashSet<Sources> getSources() {
    return sources;
  }

  public void setSources(HashSet<Sources> sources) {
    this.sources = sources;
  }
}
