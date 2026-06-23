package com.human.festapick.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController implements ErrorController {

    @RequestMapping({
            "/detail/**",
            "/search",
            "/nearby",
            "/calendar",
            "/ai",
            "/ai-recommend",
            "/donation/**",
            "/login",
            "/signup",
            "/find-id",
            "/find-password",
            "/reset-password",
            "/social-login",
            "/oauth/kakao/callback"
    })
    public String forwardReactRoutes() {
        return "forward:/index.html";
    }

    @RequestMapping("/error")
    public String handleError() {
        return "forward:/index.html";
    }
}