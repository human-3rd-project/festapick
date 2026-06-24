package com.human.festapick.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController implements ErrorController {

    @GetMapping(
            value = {
                    "/detail/**",
                    "/search",
                    "/nearby",
                    "/calendar",
                    "/ai",
                    "/ai-recommend",
                    "/donation/**",
                    "/mypage/**",
                    "/festivals/*",
                    "/admin",
                    "/admin/members",
                    "/admin/reviews",
                    "/admin/festivals",
                    "/admin/donations",
                    "/login",
                    "/signup",
                    "/find-id",
                    "/find-password",
                    "/reset-password",
                    "/social-login",
                    "/oauth/kakao/callback"
            },
            produces = MediaType.TEXT_HTML_VALUE
    )
    public String forwardReactRoutes() {
        return "forward:/index.html";
    }

    @RequestMapping("/error")
    public String handleError() {
        return "forward:/index.html";
    }
}
