package com.almerys.columbia.front;

import org.springframework.boot.context.properties.ConfigurationProperties;

@org.springframework.context.annotation.Configuration
@ConfigurationProperties("app")
public class Configuration {

    private String apiUrl;
    private String matomoUrl;
    private String matomoToken;
    private long matomoIdSite;

    private String oauthClientId;
    private String oauthClientSecret;
    private String oauthEndpoint;


    public String getOauthClientId() {
        return oauthClientId;
    }

    public void setOauthClientId(String oauthClientId) {
        this.oauthClientId = oauthClientId;
    }

    public String getOauthClientSecret() {
        return oauthClientSecret;
    }

    public void setOauthClientSecret(String oauthClientSecret) {
        this.oauthClientSecret = oauthClientSecret;
    }

    public String getOauthEndpoint() {
        return oauthEndpoint;
    }

    public void setOauthEndpoint(String oauthEndpoint) {
        this.oauthEndpoint = oauthEndpoint;
    }

    public String getMatomoUrl() {
        return matomoUrl;
    }

    public void setMatomoUrl(String matomoUrl) {
        this.matomoUrl = matomoUrl;
    }

    public String getMatomoToken() {
        return matomoToken;
    }

    public void setMatomoToken(String matomoToken) {
        this.matomoToken = matomoToken;
    }

    public long getMatomoIdSite() {
        return matomoIdSite;
    }

    public void setMatomoIdSite(long matomoIdSite) {
        this.matomoIdSite = matomoIdSite;
    }

    public String getApiUrl() {
        return apiUrl;
    }

    public void setApiUrl(String api) {
        this.apiUrl = api;
    }



}
