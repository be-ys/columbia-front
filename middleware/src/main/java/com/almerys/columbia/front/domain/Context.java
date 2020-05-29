
package com.almerys.columbia.front.domain;

public class Context {
  Long id;
  String name;
  String description;
  Context parentContext;

  public Context() {
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

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Context getParentContext() {
    return parentContext;
  }

  public void setParentContext(Context parentContext) {
    this.parentContext = parentContext;
  }
}
