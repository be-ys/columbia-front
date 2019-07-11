package com.almerys.columbia.front.domain;

import java.util.HashSet;

public class SingleDefinitionImport {
  Term term;
  String def;
  HashSet<String> abbr;
  HashSet<Term> syn;
  HashSet<Term> ant;
  HashSet<Term> rel;
  HashSet<Sources> bib;
  HashSet<Sources> sou;
  Boolean rgpd;

  public SingleDefinitionImport(){

  }

  public Term getTerm() {
    return term;
  }

  public void setTerm(Term term) {
    this.term = term;
  }

  public String getDef() {
    return def;
  }

  public void setDef(String def) {
    this.def = def;
  }

  public HashSet<String> getAbbr() {
    return abbr;
  }

  public void setAbbr(HashSet<String> abbr) {
    this.abbr = abbr;
  }

  public HashSet<Term> getSyn() {
    return syn;
  }

  public void setSyn(HashSet<Term> syn) {
    this.syn = syn;
  }

  public HashSet<Term> getAnt() {
    return ant;
  }

  public void setAnt(HashSet<Term> ant) {
    this.ant = ant;
  }

  public HashSet<Term> getRel() {
    return rel;
  }

  public void setRel(HashSet<Term> rel) {
    this.rel = rel;
  }

  public HashSet<Sources> getBib() {
    return bib;
  }

  public void setBib(HashSet<Sources> bib) {
    this.bib = bib;
  }

  public HashSet<Sources> getSou() {
    return sou;
  }

  public void setSou(HashSet<Sources> sou) {
    this.sou = sou;
  }

  public Boolean getRgpd() {
    return rgpd;
  }

  public void setRgpd(Boolean rgpd) {
    this.rgpd = rgpd;
  }
}
