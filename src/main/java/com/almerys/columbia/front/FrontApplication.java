package com.almerys.columbia.front;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@EnableZuulProxy
@SpringBootApplication
public class FrontApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(FrontApplication.class, args);
	}

}
