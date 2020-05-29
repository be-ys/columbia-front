package com.almerys.columbia.front.domain;

import java.util.HashSet;

public class Term {
  Long id;
  String name;
  String text;
  HashSet<String> abbreviations;

  public Term(){

  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public HashSet<String> getAbbreviations() {
    return abbreviations;
  }

  public void setAbbreviations(HashSet<String> abbreviations) {
    this.abbreviations = abbreviations;
  }
}
